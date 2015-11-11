/**
 * Shadow Plugin  -  datetimepicker
 * @author chaoliu@meilishuo.com
 * @nosideeffects this must include after the shadow.js
 */

// Add a resolver function to the beginning of the resolver list
// This will make it run before any other ones
Shadow.defaults.resolvers.unshift(function(schema) {
    if (schema.type === "date") {
        return "date";
    }
    // If no valid editor is returned, the next resolver function will be used
});



Shadow.defaults.editors.date = Shadow.defaults.editors.string.extend({
    getNumColumns: function() {
        return 3;
    },
    getValue: function() {
        return this.value;
    },
    afterInputReady: function() {
        var self = this,
            options;
        $(self.input).datetimepicker({
            format: self.options.format || "YYYY-MM-DD"
        })

        $(self.input).blur(function(e){
        	self.value = $(this).val();
        	self.change();
        });
    }
});


// Specify upload handler
Shadow.defaults.options.upload = function(type, file, cbs) {
    if (type === 'root.upload_fail') cbs.failure('Upload failed');
    else {

        var tick = 0;
        var tickFunction = function(url) {
            tick += 1;
        };
        window.setTimeout(tickFunction)
        var formData = new FormData();
        formData.append('codecsv',file)
        
        $.ajax({
          url:'/template/uploadImage',
          type:'post',
          data: formData,
          contentType: false,  
          processData: false,
          beforeSend:function(){
            if(!file.checkResult&&file.options.checked){
              alert("图片分辨率要求为 "+file.options.width+" x "+file.options.height)
              return false;
            }
            cbs.updateProgress(tick);
            window.setTimeout(tickFunction, 500)
          },
          success:function(data){
            cbs.updateProgress();
            window.setTimeout(tickFunction, 500)
            cbs.success(data.url);
            alert("上传成功")
          },
          error: function (data, status, e){
          }
        });  

    }
};

Shadow.defaults.editors.upload = Shadow.AbstractEditor.extend({
  getNumColumns: function() {
    return 4;
  },
  build: function() {    
    var self = this;
    this.title = this.header = this.label = this.theme.getFormInputLabel(this.getTitle());
    // Input that holds the base64 string
    this.input = this.theme.getFormInputField('hidden');
    this.container.appendChild(this.input);

    if(!this.schema.readOnly && !this.schema.readonly) {

      if(!this.jsoneditor.options.upload) throw "Upload handler required for upload editor";

      // File uploader
      this.uploader = this.theme.getFormInputField('file');

      this.uploader.addEventListener('change',function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        if(this.files && this.files.length) {
          var fr = new FileReader();
          fr.onload = function(evt) {
            self.preview_value = evt.target.result;
            self.refreshPreview();
            self.onChange(true);
            fr = null;
          };
          fr.readAsDataURL(this.files[0]);
        }
      });
    }

    var description = this.schema.description;
    if (!description) description = '';

    this.preview = this.theme.getFormInputDescription(description);
    this.container.appendChild(this.preview);

    this.control = this.theme.getFormControl(this.label, this.uploader||this.input, this.preview);
    var btn = $('<button class="btn btn-default btn-block"></button>').get(0);
    var div = $('<div class="box" style="height:35px; width=600px;"></div>')
    var input = $(this.control).find('input').attr('style','width:375px;opacity:0;position:absolute;z-index:10').addClass('col-md-4')
    var button = $('<button class="btn btn-default col-md-4" style="position:absolute;">点击此处选择图片</button>');
    input.appendTo(div)
    button.appendTo(div)
    this.container.appendChild(this.control);
    div.insertBefore($(this.container).find('p'))

  },
  refreshPreview: function() {
    if(this.last_preview === this.preview_value) return;
    this.last_preview = this.preview_value;

    this.preview.innerHTML = '';
    
    if(!this.preview_value) return;

    var self = this;
    var mime = this.preview_value.match(/^data:([^;,]+)[;,]/);
    if(mime) mime = mime[1];
    if(!mime) mime = 'unknown';

    var file = this.uploader.files[0];

    this.preview.innerHTML = '<strong id="xx">类型:</strong> '+mime+', <strong>大小:</strong> '+file.size+' bytes';
    if(mime.substr(0,5)==="image") {
        var image = new Image();
        img = image;
        image.src = this.preview_value;
        var ifUpload = true;
        image.onload = function() {
          if(self.options.width==image.width&&self.options.height==image.height){
            self.checkResult = true
          }else{
            self.checkResult = false
          }
          if(ifUpload){
            var mark = "<span><strong>分辨率: </strong>" + image.width + 'x' + image.height +", "+ "</span>";
            $(mark).insertBefore($(self.preview).find('strong').eq(0))
          }
          ifUpload = false;
          self.preview.appendChild(img);
        }
        this.preview.innerHTML += '<br>';
        // var img = document.createElement('img');
        var flag = $(this.container).find('img').attr('src');
        if(flag){
          $(this.container).find('img').hide();
        }
    }

    //this.preview.innerHTML += '<br>';

    var uploadButton = this.getButton('上传', 'upload', 'Upload');
    $(uploadButton).attr("style","margin-left:390px;")
    $(uploadButton).appendTo($(this.container).find('.box'))
    uploadButton.addEventListener('click',function(event) {
      var filename = $(self.container).find('input');
      event.preventDefault();
      uploadButton.setAttribute("disabled", "disabled");
      self.theme.removeInputError(self.uploader);
      if (self.theme.getProgressBar) {
        self.progressBar = self.theme.getProgressBar();
        self.preview.appendChild(self.progressBar);
      }
      file.checkResult = self.checkResult
      file.options = self.options
      self.jsoneditor.options.upload(self.path, file, {
        success: function(url) {
          self.setValue(url);

          if(self.parent) self.parent.onChildEditorChange(self);
          else self.jsoneditor.onChange();

          if (self.progressBar) self.preview.removeChild(self.progressBar);
          uploadButton.removeAttribute("disabled");
        },
        failure: function(error) {
          self.theme.addInputError(self.uploader, error);
          if (self.progressBar) self.preview.removeChild(self.progressBar);
          uploadButton.removeAttribute("disabled");
        },
        updateProgress: function(progress) {
          if (self.progressBar) {
            if (progress) self.theme.updateProgressBar(self.progressBar, progress);
            else self.theme.updateProgressBarUnknown(self.progressBar);
          }
        }
      });
    });
  },
  enable: function() {
    if(this.uploader) this.uploader.disabled = false;
    this._super();
  },
  disable: function() {
    if(this.uploader) this.uploader.disabled = true;
    this._super();
  },
  setValue: function(val) {
    if(this.value !== val) {
      this.value = val;
      this.input.value = this.value;
      if(this.options.upload){
      if(val){
            var flag = $(this.container).find('img').attr('src');
            if(!flag){
              $("<img src='"+val+"'/>").appendTo(this.container);
            }else{
              $(this.container).find('img').attr('src',val);
            }
        }
        //this.refreshPreview();
      }
      this.onChange();
    }
  },
  destroy: function() {
    if(this.preview && this.preview.parentNode) this.preview.parentNode.removeChild(this.preview);
    if(this.title && this.title.parentNode) this.title.parentNode.removeChild(this.title);
    if(this.input && this.input.parentNode) this.input.parentNode.removeChild(this.input);
    if(this.uploader && this.uploader.parentNode) this.uploader.parentNode.removeChild(this.uploader);
    this._super();
  }
});