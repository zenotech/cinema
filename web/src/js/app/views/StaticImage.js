(function () {
    // Create Composite data type view assembly

    cinema.viewFactory.registerView('parametric-image-stack', 'view', function (rootSelector, viewType, model) {
        var container = $(rootSelector),
            fakeToolbarRootView = {
                update: function(root) {
                    this.$el = $('.c-view-panel', root);
                },
                '$el': $('.c-view-panel', container)
            },
            dataType = model.getDataType(),
            controlModel = new cinema.models.ControlModel({ info: model }),
            viewpointModel = new cinema.models.ViewPointModel({ controlModel: controlModel }),
            histogramModel = new cinema.models.StaticHistogramModel({ basePath: model.get('basePath') }),
            renderer = new cinema.views.StaticImageVisualizationCanvasWidget({
                el: $('.c-body-container', container),
                model: model,
                controlModel: controlModel,
                viewpoint: viewpointModel
            }),
            mouseInteractor = new cinema.utilities.RenderViewMouseInteractor({
                renderView: renderer,
                camera: viewpointModel
            }).enableMouseWheelZoom({
                maxZoomLevel: 10,
                zoomIncrement: 0.05,
                invertControl: false
            }).enableDragPan({
                keyModifiers: cinema.keyModifiers.SHIFT
            }).enableDragRotation({
                keyModifiers: null
            }),
            controlTools = new cinema.views.ToolsWidget({
                el: $('.c-tools-panel', container),
                model: model,
                controlModel: controlModel,
                viewport: renderer,
                toolbarSelector: '.c-panel-toolbar',
                toolbarRootView: fakeToolbarRootView
            }),
            staticHistogram = new cinema.views.StaticHistogramWidget({
                el: $('.c-static-histogram-panel', container),
                basePath: model.get('basePath'),
                histogramModel: histogramModel,
                viewpoint: viewpointModel,
                controlModel: controlModel,
                visModel: model,
                toolbarSelector: '.c-panel-toolbar'
            }),
            controlList = [
                { position: 'right', key: 'tools', icon: 'icon-tools', title: 'Tools' },
                { position: 'center', key: 'static-histogram', icon: 'icon-chart-bar', title: 'Histogram' }
            ],
            firstRender = true;

            function render () {
                var root = $(rootSelector);
                fakeToolbarRootView.update(root);
                renderer.setElement($('.c-body-container', root)).render();
                controlTools.setElement($('.c-tools-panel', root)).render();
                staticHistogram.setElement($('.c-static-histogram-panel', root)).render();
                refreshCamera(true);
                if (firstRender) {
                    firstRender = false;
                    $('.c-static-histogram-panel', root).hide();
                }
            }

            function refreshCamera () {
                renderer.showViewpoint();
            }

            function resetCamera () {
                renderer.resetCamera();
            }

            controlModel.on('change', refreshCamera);
            viewpointModel.on('change', refreshCamera);
            cinema.events.on('c:resetCamera', resetCamera);

        return {
            controlList: controlList,
            render: render
        };
    });
}());
