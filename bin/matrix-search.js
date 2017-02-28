#!/usr/bin/env node

require('./matrix-init');
var debug = debugLog('search');

Matrix.localization.init(Matrix.localesFolder, Matrix.config.locale, function () {

  if (!Matrix.pkgs.length || showTheHelp) {
    return displayHelp();
  }

  Matrix.validate.user(); //Make sure the user has logged in
  debug(Matrix.pkgs);
  var needle = Matrix.pkgs[0];

  if (needle.length <= 2) {
    return console.error(t('matrix.search.small_needle') + '.')
  }

  Matrix.loader.start();
  Matrix.firebaseInit(function () {

    Matrix.helpers.trackEvent('app-search', { aid: needle });

    Matrix.firebase.app.search(needle, function (data) {
      Matrix.loader.stop();

      debug(data);
      if ( _.isNull(data)  || data.meta.visible === false ) {
        console.log(t('matrix.search.no_results').green);
        process.exit();
      } else {
        if (!_.isArray(data) && !_.isUndefined(data) && !_.isNull(data) ) {
          data = [data];
        }
        if (_.isEmpty(data) || _.isUndefined(data)) {
          console.log(t('matrix.search.no_results').green);
        } else {
          Matrix.helpers.displaySearch(data, needle);
        }
        process.exit();
      }
    });
    //Get versionId of appId with version X
  });

  function displayHelp() {
    console.log('\n> matrix search ¬\n');
    console.log('\t                 matrix search <app> -', t('matrix.search.help').grey)
    console.log('\n')
    process.exit(1);
  }
});
