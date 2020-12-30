exports.defineTags = function (dictionary) {
  dictionary.defineTag("fileName", {
      canHaveType: true,
      canHaveName: true,
      mustHaveValue: true,
      onTagged: function (doclet, tag) {
          doclet.fileNames = doclet.fileNames || [];
          doclet.fileNames.push(tag.value);
          // debugger
          // doclet.params = doclet.params || []
          // doclet.params.push(tag.value)
      }
  });
}; 

exports.handlers = {
  newDoclet: function(e) {
    // console.log('wink~', e.doclet.protocols)
    // if (parameters) {
    //   const table = tableBuilder.build('Route Parameters', parameters);

    //   e.doclet.description = `${e.doclet.description}
    //                           ${table}`;
    // }
  },
  parseComplete(e) {
    
    // console.log(e.doclets, e.sourcefiles)
  }
}
