<div class="container-fluid">
<ul class="slideshow-container"></ul>
</div>

<span class="control-panel-fullscreen-button" data-toggle="tooltip" data-placement="left" title="Toggle Fullscreen"><i class="fa fa-expand fa-2x"></i></span>

<span class="control-panel-prev-button"><i class="fa fa-chevron-left fa-5x"></i></span>

<span class="control-panel-next-button"><i class="fa fa-chevron-right fa-5x"></i></span>

<span class="control-panel-resume-button"><i class="fa fa-play fa-5x"></i></span>

<div class="resumeMenu ">Click <i class="fa fa-play"></i> or Press the <strong>Space Bar</strong> to resume slideshow</div>

<span class="control-panel-open" data-toggle="tooltip" data-placement="top" title="Press ctrl/cmd + c to open"><i class="fa fa-cogs fa-2x"></i></span>
<span class="control-panel-close" data-toggle="tooltip" data-placement="left" title="Press Esc to close"><i class="fa fa-times fa-2x"></i></span>

<div class=" container-fluid control-panel">
	<h2> Control Panel </h2>
	<div class="row">
		<div class="col-md-6 small-buffer">
			
			<h5><i class="fa fa-photo"></i> Current Photo </h5>
			<div class="divider"></div>
			<div id="CurrPhotoLink"></div>
			<div id="CurrPhotoFromName"></div>
			<div id="CurrPhotoCaption"></div>

			<h5><i class="fa fa-gear"></i> Options </h5>
			<div class="divider"></div>
			<div class="small-buffer">
				Full Page <input id="FullPage" type="checkbox" data-size="small">
			</div>
			<div class="small-buffer">
				Caption <input id="Caption" type="checkbox" data-size="small">
			</div>
			<div class="small-buffer">
				ADJUSTED_TIME(second): <input type="number" id="ADJUSTED_TIME">
			</div>

		</div>
		<div class="col-md-6 small-buffer">
			<h5><i class="fa fa-list"></i> Sources </h5>
			<div class="divider"></div>
			<div class="form-group">
				<input type="text" class="form-control small-buffer" id="ADD_SOURCE" placeholder="Enter facebook id">
				<button type="submit" class="btn btn-primary small-buffer" id="add_source-btn" data-loading-text="checking...">Add Source</button>
			</div>
			<div id="sources"></div>
		</div>
	</div>
	<button class="btn btn-primary large-buffer" id="saveSetting" >Save Setting</button>
</div>


<script id="sources-template" type="text/x-handlebars-template">
  {{#each this}}
  	<div id="source-{{this.id}}" data-id="{{this.id}}" data-name="{{#if this.name}}
	  			{{this.name}}
	  		{{else}}
	  			{{this.id}}
	  		{{/if}}" class="small-buffer">
  		<input name="enable-btn" type="checkbox" {{#if this.enabled}}checked{{/if}}>
  		{{#if this.link}}
  			<a href="{{this.link}}" target="_blank">
  		{{/if}}
	  		{{#if this.name}}
	  			{{this.name}}
	  		{{else}}
	  			{{this.id}}
	  		{{/if}}
	  	{{#if this.link}}
	  	</a>
	  	{{/if}}
	  	<button class="btn btn-default btn-sm" name="remove-btn"><i class="fa fa-trash-o"></i></button>
  	</div>
  {{/each}}
</script>