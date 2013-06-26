
var utils = module.exports,
	debug = function(err){ if (_debug = true) console.log(err); };

var write_default,
	end_default;

utils.replaceSnippet = function(req,res,next){
	if (write_default === undefined) write_default = res.write;
	if (end_default === undefined) end_default = res.end;

	var data = [];

	res.write = function (chunk, encoding){
		if (chunk.length === 0 || !this._hasBody) return false;

		var chunk_str = chunk instanceof Buffer ? chunk.toString(encoding) : chunk,
			isHTML = /text\/html\;.*/.test(req.client._httpMessage._headers['content-type']);

		if (isHTML){
			chunk_str = setupHTML(req, res, chunk_str);
			chunk_str = addLrSnippet(req, res, chunk_str);
		}

		data.push(chunk_str);

		return true;
	}

	res.end = function (chunk,encoding){
		var data_out = data.join();
		if (!this._header && data_out.length !==0) {
			this.setHeader('content-length', Buffer.byteLength(data_out, encoding));
			this._implicitHeader();
		}

		end_default.call(res,data_out,encoding);
	}

	next();
}

// setup HTML for localserver
function setupHTML(req, res, str){
	debug('setupHTML:')

	var nestLevel = req.originalUrl.split('/').length -1,
		relativeBase = new Array(nestLevel).join('../');

	return str
			.replace(/http:\/\/s3\.iaarchiver\.net\//gm, relativeBase)
			.replace(/http:\/\/iaarchiver\.net\//gm, '');

}

// add script for LiveReload
function addLrSnippet(req, res, str){
	debug('addLrSnippet:')

	var port = '35729',
		insert = [
			"<!-- livereload snippet -->",
			"<script>document.write('<script src=\"http://'",
			" + (location.host || 'localhost').split(':')[0]",
			" + ':" + port + "/livereload.js?snipver=1\"><\\/script>')",
			"</script>",
			""
			].join('\n');

	return str.replace(/<\/body>/, function(w){
					return insert + w;
				});
}
