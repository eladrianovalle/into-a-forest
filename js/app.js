(function(){  // Immediately-Invoked Function Expression
  // var controls = $('.controls')
  //     , playButton = $('.play-button');
  
  // playButton.on('click', function(){
  //   controls.addClass('hidden');

  // About Page Module
  function tabSvgGenerator( type ) {
    var theTab = $('.' + type + 'Tab')
        , theSVG = $('#' + type ).html();
    theTab.append(theSVG);
  }

  tabSvgGenerator('theKnight');
  tabSvgGenerator('theGirl');
  tabSvgGenerator('theEnemy');
  tabSvgGenerator('theForest');
  tabSvgGenerator('theDev');

  var tab = $('.tab-title');

  tab.on( 'click', function(){
    $(document).foundation();
    $(document).foundation('equalizer', 'reflow');
  })













})();