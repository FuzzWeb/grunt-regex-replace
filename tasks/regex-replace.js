/*
 * grunt-regex-replace
 * https://github.com/bomsy/grunt-regex-replace
 *
 * Copyright (c) 2012 Hubert Boma Manilla
 * Licensed under the MIT license.
 *
 */

module.exports = function(grunt) {
  "use strict";
  // Please see the grunt documentation for more information regarding task and
  // helper creation: https://github.com/gruntjs/grunt/blob/master/docs/toc.md

  // ==========================================================================
  // TASKS
  // ==========================================================================
  grunt.registerMultiTask('regex-replace', 'find & replace content of a file based regex patterns', function(){
    var actions = this.data.actions,
      arrString = "[object Array]",
      regexString = "[object RegExp]",
      toString = Object.prototype.toString,
      GLOBAL = 'g',
      options = null,
      srchAction = null,
      rplAction = null,
      updatedContent;

    this.files.forEach(function(file) {
      file.src.forEach(function(filepath) {

        if(toString.call(actions) === arrString){
          updatedContent = grunt.file.read(filepath);
          for(var j = 0; j < actions.length; j++){
            srchAction = actions[j].search,
            rplAction = actions[j].replace; 
            options = actions[j].flags;
            if(typeof options === 'undefined'){
              options = GLOBAL;
            }
            if( (typeof srchAction !== 'string' && toString.call(srchAction) !== regexString ) || (typeof rplAction !== 'string' && typeof rplAction !== 'function') || typeof options !== 'string' ){
              grunt.warn('An error occured while processing (Invalid type passed for \'search\' or \'replace\' of \'flags\', only strings accepted.)' );
            }
            if(typeof srchAction === 'string'){
              srchAction = grunt.template.process(srchAction);
            }
            if(typeof rplAction === 'string'){
              rplAction = grunt.template.process(rplAction);
            }
            updatedContent = regexReplace( updatedContent, srchAction, rplAction , options, j, actions[j].name);
          }
          grunt.file.write(file.dest, updatedContent);
          if(file.errorCount){
            return false;
          } 
          grunt.log.writeln('File \'' + filepath + '\' replace complete.');
        }

      });
    });

  });
  // ==========================================================================
  // HELPERS
  // ==========================================================================

 var regexReplace = function(src, regex, substr, options, index, actionName){
    //takes the src content and changes the content
    var regExp = null,
        updatedSrc;
    if(typeof regex ===  'string'){ 
      regExp = new RegExp(regex , options); //regex => string
    } else {
      regExp = regex; //regex => RegExp object
    }
    updatedSrc = String(src).replace(regExp, substr); //note: substr can be a function
    index = typeof index === 'undefined' ? '' : index;
    if(!actionName){
      grunt.log.writeln(index + 1 + ' action(s) completed.');
    } else {
      grunt.log.writeln(actionName + ' action completed.');
    }
    return updatedSrc;
  };

};
