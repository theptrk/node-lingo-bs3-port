//revealing module pattern
// var Kale = (function(){
	// })(); then immediately invoke it

var AirBnB = (function() {

	// Our data.
    // Cache of rentals.
    var recordsMap ={};

    // Rental templates.
    var recordTemplate;
    var recordDetailTemplate;

  	// Overlay mask.
  	var overlay;

    // Rental filter panel.
  	var filterPanel;

  	// Filter button.
  	var filterButton;
    var filterButton2
    // Submit button
    var submitButton;

  	// Whether filter panel is shown or not.
  	var filterPanelShowing;

  // Public methods.
  var methods = {
    init: function() {
      overlay = $('#overlay');
      filterPanel = $('#filter-panel');
      filterButton = $('#filter-btn');
      filterButton2 = $('#filter-btn2');
      submitButton = $('#query-submit')
      filterPanelShowing = true;

      var source = $('#record-template').html();
      recordTemplate = Handlebars.compile(source);
      // check by using console.log(variable);
      source = $('#record-detail-template').html();
      recordDetailTemplate = Handlebars.compile(source);

      filterButton.on('click', function() {
        methods.showFilterPanel(!filterPanelShowing);
      }); //visible-xs
        filterButton2.on('click', function() {
        methods.showFilterPanel(!filterPanelShowing);
        }); //hidden-xs

      submitButton.on('click',function(){
        methods.renderRecords();
      })


      //Key clicks DOING STUFF
      $(document).keyup(function(e){
        if (e.which == 27) {
          methods.showFilterPanel(false);
        } 
        else if (e.which ==13 && filterPanelShowing){
          methods.renderRecords();
        }
      });

      //lets draw immediately
      methods.renderRecords();   
    },

    showFilterPanel: function(isPanelVisible) {
      filterPanelShowing = isPanelVisible;
      var height = filterPanel.css('height');

      // Translate filter panel by height amount.
      if (filterPanelShowing) {
        filterPanel.css({
        	'webkit-transform': 'translateY(0)'
        });
      } else {
        filterPanel.css({
        	'webkit-transform': 'translateY(-' + height + ')'
        });
      }
    },

    renderRecords: function() {
      overlay.show();
      var params = {
        url: 'http://xanadu.logicparty.org:4000/rentals' ,
        dataType: 'jsonp' ,

        //data for key value pairs
        data:{
          type: $('#query-type').val(),
          capacity: $('#query-guests').val(),
          price: $('#query-price').val(),
        },  

        success: function(records){
          var mainContent = $('#main-content');
          //clear the mainContent div
          mainContent.empty();

          var currentRow = null;
          for (var i = 0; i < records.length; i++) {
            var data = {
              id: records[i].id ,
              image: 'http://xanadu.logicparty.org:4000' + records[i].image_urls[0],
              title: records[i].title ,
              price: '$' + records[i].price + ' per night' ,
              subtitle: records[i].type + '-' + records[i].location
            };

            //populate reocrdsMap
            recordsMap[ data.id ] = data;

            var html = recordTemplate(data);

            //Create a new row ever 3 cards
            if (i % 3 == 0) {
              currentRow = $('<div>').addClass('row');
            }

            //Append HTML
            currentRow.append(html)
            mainContent.append(currentRow);
          };

          // Click listener for renderRecordDetail
          $('.record-panel').on('click', function(e){
            var id = e.currentTarget.id;
            methods.renderRecordDetail( recordsMap[id] );
          });

          overlay.hide();
        }
      };
      $.ajax(params);
    },

    renderRecordDetail: function(data) {
      var html = recordDetailTemplate(data);
      $('#modal-container').empty().append(html);
      $('#myModal').modal('show');
    }

  };

  return methods;
})();