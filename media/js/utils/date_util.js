var Date_Util = (function(_this, $) {

	_this.dateToYMD = function(date) {
		var d = date.getDate();
		var m = date.getMonth() + 1;
		var y = date.getFullYear();

		return '' + (d <= 9 ? '0' + d : d) + '.' + (m<=9 ? '0' + m : m) + '.' + y;
	}

	return _this;

}({}, jQuery));