(function() {
  var createStorageKey, host, uploadAttachment;

  document.addEventListener("trix-attachment-add", function(event) {
	console.log('>>>addEventListener<<<', event.attachment);
    var attachment;
    attachment = event.attachment;
    if (attachment.file) {
      return uploadAttachment(attachment);
    }
  });

  host = "/upload";

  uploadAttachment = function(attachment) {
	console.log('>>>uploadAttachment<<<');
	
    var file, form, key, xhr;
    file = attachment.file;
    key = createStorageKey(file);
    form = new FormData;
    form.append("key", key);
    form.append("Content-Type", file.type);
    form.append("nome", file.name);
    form.append("file", file);
    xhr = new XMLHttpRequest;
    xhr.open("POST", host, true);
    xhr.upload.onprogress = function(event) {
      var progress;
      progress = event.loaded / event.total * 100;
      return attachment.setUploadProgress(progress);
    };
    xhr.onload = function() {
      var href, url;
      //if (xhr.status === 204) {
    	console.log('this.responseText: '+this.responseText );
    	var json = JSON.parse( this.responseText );
        url = json.foto
        return attachment.setAttributes({
          url: url,
          href: href
        });
      //}
    };
    return xhr.send(form);
  };

  createStorageKey = function(file) {
    var date, day, time;
    date = new Date();
    day = date.toISOString().slice(0, 10);
    time = date.getTime();
    return "tmp/" + day + "/" + time + "-" + file.name;
  };

}).call(this);
