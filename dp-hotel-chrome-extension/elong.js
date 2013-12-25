var btn = null;
var options = null;
var xposition = '223px;';
var yposition = '776.5px; ';
var otaId = 1;

$(function(){
    var chartContainer = '<div id="dp_price_chart_container"'
    + 'style="position: relative; '
    + 'width: 350px; '
    + 'text-align: center; '
    + 'line-height: 100px; '
    + 'height:100px;";>'
    + '正在加载...'
    + '</div>';

    var outterContainer = '<div id="dp_container"' 
    + 'style="position: absolute; '
    + 'width: 356px; '
    + 'padding-top: 3px; '
    + 'top: ' + xposition
    + 'left: ' + yposition
    + 'background: #ffffff;'
    + 'display: none; '
    + 'z-index: 2147483647;">'
    + '<div style="padding-top: 0px; border: 3px solid; border-color: #F08006;">'
    + chartContainer
    + '<div id="priceBlock">'
    + '</div>'
    + '</div>'
    + '</div>';

    $(document.body).append(outterContainer);
});

function buildPrice(otaName, price, promo, refund, href){
    var priceBtn = '<div style="align-content: right; '
    + 'display: inline; '
    + 'font-weight: bold; font-size: 16px; '
    + 'background: #F08006; '
    + 'padding-top: 4px; '
    + 'padding-left: 4px; '
    + 'padding-right: 6px; '
    + 'padding-bottom: 4px; '
    + 'color: #ffffff; '
    + 'text-align: center; '
    + 'margin-left: 40px; '
    + 'border-radius: 3px; '
    + 'box-shadow: 1px 1px 1px #888888; '
    + '">'
    + (0 < price ? ("￥" + price) : '优惠价')
    + '</div>';

    var onePrice = '<div style="padding-left: 15px;'
    + 'display: inline;'
    + '">'
    + otaName
    + (null == promo ? '<div style="padding-left: 100px; display: inline;"></div>' : promo)
    + (null == refund ? '<div style="padding-left: 80px; display: inline;"></div>' : refund)
    + priceBtn
    + '</div>';

    var priceContent = '<a style="text-decoration: none; color: #000000;" target="_blank" href=' + href + '>'
    + '<div class="dp_ota_price_container"'
    + 'style="position: relative; '
    + 'width: 344px; '
    + 'margin-bottom: 2px; '
    + 'margin-left: 3px; '
    + 'margin-right: 3px; '
    + 'background: #f3f3f3;'
    + 'vertical-align: middle; '
    + 'line-height: 50px; '
    + 'height:50px;";>'
    + onePrice
    + '</div>'
    + '</a>';

    return priceContent;
}

function buildIcon(logoText, content, color){
    var iconContent = '<div style="display:inline;'  
    + 'background: #ffffff; '
    + 'border: 1px solid ' + color + '; '
    + 'padding-top: 2px; '
    + 'padding-left: 3px; '
    + 'padding-right: 3px; '
    + 'padding-bottom: 2px; '
    + 'color: ' + color + '; '
    + '">'
    + content
    + '</div>';

    var icon = '<div style="margin-left: 20px; '
    + 'display:inline; '
    + 'background: ' + color + '; '
    + 'border: 1px solid ' + color + '; '
    + 'height: 50px; '
    + 'width: 50px; '
    + 'font-size: 13px; '
    + 'padding-top: 1px; '
    + 'padding-left: 2.5px; '
    + 'padding-right: 2.5px; '
    + 'padding-bottom: 1px; '
    + 'color: #ffffff; '
    + '">'
    + logoText
    + '</div>';

    return icon + (null == content || content == '' ? '' : iconContent);
}

function appendPrice(){
    if($('#priceBlock').text() == ''){
        var priceUrl = 'http://w.alpha.dp/index/hotel/ajax/otaCompare?currentURL=' + window.location.origin + window.location.pathname;
        $.getJSON(priceUrl, function(json){
            if(json.code == 200){
                var entirePriceBlock = '';
                $.each(json.msg, function(index, value){
                    if(value.otaID != otaId){
                        var promoDiv = null;
                        var refundDiv = null;
                        var promoArray = jQuery.parseJSON(value.promo);
                        $.each(promoArray, function(index, value){
                            if(value.type == 4) refundDiv = buildIcon('返', value.discount, '#ffb12a');
                            if(value.type == 3) promoDiv = buildIcon('促', value.description, '#84b328');
                        });
                        entirePriceBlock = entirePriceBlock + buildPrice(value.otaName, value.avgLowPrice, promoDiv, refundDiv, value.url);
                    }
                });
                if(entirePriceBlock != ''){
                    $('#priceBlock').html('');
                    $('#priceBlock').html(entirePriceBlock);
                }
                $('.dp_ota_price_container').hover(
                    function(){
                        $(this).css("background", "#ececec");
                    },
                    function(){                
                        $(this).css("background", "#f3f3f3");
                    }
                );
            }
        });
    }
}

function appendChart(){

    function initialChart(){
        options = {
            chart: {
                renderTo: 'dp_price_chart_container',
                type: 'line',
                margin: [4, 4, 18, 4]
            },
            title: {
                text: null
            },
            plotOptions: {
                series: {
                    color: '#F08006',
                    dataLabels: {
                        enabled: true
                    },
                }
            },
            tooltip: {
                crosshairs: [true, true]
            },
            yAxis: {
                title: {text: null},
                labels: "",
                minorTickInterval: "auto",
                showFirstLabel: false
            },
            xAxis: {
                type: 'category',
                minorTickInterval: 1,
                gridLineWidth: 1,
                tickWidth: 0,
            },
            legend: {
                enabled: false
            },
            credits: {  
                enabled: false  
            }, 
            series: []
        };
    }

    function drawChart(otaName, otaData){
        initialChart();
        options.series.push({
            name: otaName,
            data: otaData
        });
    }

    if(null == options || $('#dp_price_chart_container').text() == '正在加载...' || $('#dp_price_chart_container').text() == '暂时无法获取价格走势'){
        $('#dp_price_chart_container').html('正在加载...');
        var priceUrl = 'http://w.alpha.dp/index/hotel/ajax/priceTrend?currentURL=' + window.location.origin + window.location.pathname;
        $.getJSON(priceUrl, function(json){
            if(json.code == 200){
                $.each(json.msg, function(index, value){
                    if(value.otaID == otaId){
                        var trends = value.trend;
                        var otaName = value.otaName;
                        var otaData = [];
                        $.each(trends, function(index, value){
                            var formatdate = new String(value.priceDate).substring(5, 10).replace('-','/');
                            var oneDayPrice = [formatdate, value.lowPrice];
                            otaData.push(oneDayPrice);
                        });
                        $('#dp_price_chart_container').html('');
                        drawChart(otaName, otaData);
                        if(null == options) return;
                        var chart = new Highcharts.Chart(options);
                    }
                });
            } else {
                refresh();
            }
        }).error(function(){
            refresh();
        });
    }

    function refresh(){
        $('#dp_price_chart_container').html('<a id="dp_refreshchart" style="cursor: pointer;">暂时无法获取价格走势</a>');
        $('#dp_refreshchart').click(function(){
            appendChart();
        });
    }

    if(null == options) return;
    var chart = new Highcharts.Chart(options);
}

$(bindBtnDiv());

function bindBtnDiv(){
    if(null != btn) return;

    var btnDiv = $('#divHotelPrice');
    btnDiv.hover(
         function(){
            bindBtn();
        },
        function(){}
    );
}

function bindBtn(){
    if(null != btn) return;

    $(".btn").each(
        function(index){
            if (null == btn && $(this).text() == '立即预订') {
                btn = $(this);
            }
        }
    );

    if(null == btn) return;

    var dpDiv = $('#dp_container');
    btn.hover(
        function(){
            dpDiv.show();
            appendChart();
            appendPrice();
        },
        function(){
            dpDiv.hide();
        }
    );
    dpDiv.hover(
        function(){
            dpDiv.show();
        },
        function(){
            dpDiv.hide();
        }
    );
}