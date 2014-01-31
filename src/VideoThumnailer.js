(function(global) {
	var scopeUtils = {
		/**
		 * Returns a custom scope function
		 * @param {object} callbackContext Scope to be passed to the callback
		 * @param {function} callback Function to call
		 * @returns {function} 
		 */
		relegate: function(callbackContext, callback) {
			var a = Array.prototype.slice.call(arguments, 2);
			return function() {
				var args = Array.prototype.slice.call(arguments, 0);
				return callback.apply(callbackContext, Array.prototype.concat.call(a, args));
			};
		}
	};
	global.ScopeUtils = scopeUtils;
}(window));

(function (global) {
	var videoThumbnailer = {
		init: function (mediaFilePath) {
			this.canvas = document.createElement("canvas");
			this.tbnGen = document.createElement('video');
			
			this.canvas.style.visibility = 'hidden';
			this.tbnGen.style.visibility = 'hidden';
			
			this.tbnGen.src = mediaFilePath;
			this.tbnGen.load();
			
			this.tbnGen.addEventListener('loadeddata', ScopeUtils.relegate(this, this.readyRlg));
			this.tbnGen.addEventListener('seeked', ScopeUtils.relegate(this, this.getRlg));
		},
		get: function (maxWidth, maxHeight, time, callbackResult) {
			this.maxWidth = maxWidth;
			this.maxHeight = maxHeight;
			this.callbackResult = callbackResult;
			this.tbnGen.currentTime = time;
		},
		getRlg: function () {
			var scale = (
				this.maxWidth <= this.maxHeight ?
				(this.maxWidth * 1.0) / this.tbnGen.videoWidth :
				(this.maxHeight * 1.0) / this.tbnGen.videoHeight
			);
			var img = document.createElement("img");
			
			this.canvas.width = this.tbnGen.videoWidth * scale;
			this.canvas.height = this.tbnGen.videoHeight * scale;
			this.canvas.getContext('2d').drawImage(this.tbnGen, 0, 0, this.canvas.width, this.canvas.height);
			
			img.src = this.canvas.toDataURL();
			this.callbackResult(img);
		},
		readyRlg: function () {
			this.ready(this.tbnGen);
		},
		ready: function (player) {
		}
	};
	global.VideoThumbnailer = videoThumbnailer;
}(window));