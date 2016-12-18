var TACTICAL = (function(o) {

    var canvas

    var game = {

        ctx: null, 
        WIDTH: 0, 
        HEIGHT: 0, 
        ROWS: 0, 
        COLS: 0,
        VIEWPORT: { },
        CENTER_X: function() {
            return this.WIDTH / 2;
        },
        CENTER_Y: function() {
            return this.HEIGHT / 2;
        },
        TILE_SIZE: 0,
        HALF_PIXEL: 0.5,

        unselectedTile: {
            fillStyle: "rgb(255,255,255)",
            strokeStyle: "rgb(0,0,0)"

        },
        selectedTile: {
            fillStyle: "rgb(255,0,0)",
            strokeStyle: "rgb(0,0,0)"
        },
        highlightedTile: {
            fillStyle: "rgb(0,255,0)",
            strokeStyle: "rgb(0,0,0)"
        },

        EventTypeEnum: Object.freeze({
            CLICK: 1, 
            MOVE: 2,
            LEFT: 3,
            RIGHT: 4
        }),

        // map: [
        //     0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        //     0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        //     0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        //     0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        //     0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        //     0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        //     0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        //     0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        //     0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        //     0, 0, 0, 0, 0, 0, 0, 0, 0, 0
        // ],

        init: function(c) {

            this.ctx = canvas.getContext('2d')

            this.ctx.fillStyle = this.unselectedTile.fillStyle
            this.ctx.fillRect(0, 0, c.width, c.height)

            this.WIDTH   = c.width
            this.HEIGHT  = c.height
            this.ROWS    = 10
            this.COLS    = 10
            this.TILE_SIZE = 64
            this.VIEWPORT = { 
                x: -(this.TILE_SIZE * this.ROWS), 
                y: 0, 
                minX: -(this.TILE_SIZE * this.ROWS), 
                maxX: this.TILE_SIZE * this.ROWS,
                width: c.width,
                height: c.height 
            }

            var that = this

            c.onclick = function(e) {
                that.handleEvent.call(that, that.EventTypeEnum.CLICK, { x: e.offsetX, y: e.offsetY })
            }

            c.onmousemove = function(e) {
                that.handleEvent.call(that, that.EventTypeEnum.MOVE, { x: e.offsetX, y: e.offsetY })
            }

            document.addEventListener('keydown', function(e) {
                switch(e.which) {
                    case 37: // LEFT
                        that.handleEvent.call(that, that.EventTypeEnum.LEFT, e)
                        break;
                    case 39: // RIGHT
                        that.handleEvent.call(that, that.EventTypeEnum.RIGHT, e)
                        break;
                    default:
                        break;
                }                
            })

            this.draw()

        },

        isometricToCartesian2D : function(p) {
            
            return {
                x: (2 * p.y + p.x) / 2,
                y: (2 * p.y - p.x) / 2
            }

        },

        cartesian2DToIsometric: function(p) {

            return {
                x: p.x - p.y,
                y: (p.x + p.y) / 2
            }

        },

        draw: function() {

            var currentRow = 0, currentColumn = 0
            for(var i=0; i < this.ROWS * this.COLS; i += 1) {

                // Next row
                if ( currentRow != parseInt( (i / this.ROWS), 10) ) {
                    currentRow = parseInt( (i / this.ROWS), 10)
                    currentColumn = 0    
                }

                this.drawIsoTile(currentColumn * this.TILE_SIZE,
                    currentRow * this.TILE_SIZE,
                    -(this.VIEWPORT.x),
                    this.VIEWPORT.y,
                    this.unselectedTile)
                
                currentColumn += 1

            }



        },

        moveViewport: function(offsetX, offsetY) {
            this.VIEWPORT.x += offsetX
            this.VIEWPORT.y += offsetY

            console.log('offsetX: ' + offsetX + ', offsetY: ' + offsetY)
            console.log('this.VIEWPORT.minX: ' + this.VIEWPORT.minX + ', this.VIEWPORT.maxX: ' + this.VIEWPORT.maxX)

            if(this.VIEWPORT.x < this.VIEWPORT.minX) {
                this.VIEWPORT.x = this.VIEWPORT.minX
            }

            if( (this.VIEWPORT.x + this.VIEWPORT.width) > this.VIEWPORT.maxX) {
                this.VIEWPORT.x = this.VIEWPORT.maxX - this.VIEWPORT.width
            }

            this.ctx.clearRect(0, 0, this.WIDTH, this.HEIGHT)
            
            console.log('viewport: ' + this.VIEWPORT.x + ', ' + this.VIEWPORT.y)
            
            this.draw()
        },

        drawIsoTile: function(upperLeftX, upperLeftY, offsetX, offsetY, style) {

            this.ctx.fillStyle = style.fillStyle
            this.ctx.strokeStyle = style.strokeStyle

            var x = 0,
                y = 0,
                offsetX = offsetX || 0,
                offsetY = offsetY || 0,
                points = [ 
                    this.cartesian2DToIsometric({ x: upperLeftX, y: upperLeftY }),
                    this.cartesian2DToIsometric({ x: upperLeftX + this.TILE_SIZE, y: upperLeftY }),
                    this.cartesian2DToIsometric({ x: upperLeftX + this.TILE_SIZE, y: upperLeftY + this.TILE_SIZE }),
                    this.cartesian2DToIsometric({ x: upperLeftX, y: upperLeftY + this.TILE_SIZE })
                ],
                isoPoint = {}

            this.ctx.beginPath()
            this.ctx.moveTo(points[0].x + offsetX, points[0].y + offsetY)
            this.ctx.lineTo(points[1].x + offsetX, points[1].y + offsetY)
            this.ctx.lineTo(points[2].x + offsetX, points[2].y + offsetY)
            this.ctx.lineTo(points[3].x + offsetX, points[3].y + offsetY)
            this.ctx.closePath() // draws last line of the tile
            this.ctx.stroke()
            
            this.ctx.fill()
        },

        selectIsoTile: function(e, style) {

            console.log('screen point: ' + e.x + ', ' + e.y)

            var isoPoint = { x: this.VIEWPORT.x + e.x, y: this.VIEWPORT.y + e.y }
            var cartPoint = this.isometricToCartesian2D(isoPoint)

            console.log('iso point: ' + isoPoint.x + ', ' + isoPoint.y)
            console.log('cart point: ' + cartPoint.x + ', ' + cartPoint.y)

            if(cartPoint.x < 0 || cartPoint.y < 0)
                return;

            var row = parseInt(cartPoint.y / this.TILE_SIZE, 10), 
                col = parseInt(cartPoint.x / this.TILE_SIZE, 10)

            console.log('row: ' + row + ', col: ' + col)

            if(row < 0 || col < 0 || row >= this.ROWS || col >= this.COLS)
                return;

            style = style || this.selectedTile
            console.log(style)

            this.drawIsoTile(col * this.TILE_SIZE, row * this.TILE_SIZE,
                            -(this.VIEWPORT.x), this.VIEWPORT.y,
                            style)
        },

        highlightIsoTile: function(e) {
            this.selectIsoTile(e, this.highlightedTile)
        },

        drawTile: function(row, col, fillStyle, strokeStyle) {

            this.ctx.fillStyle = fillStyle
            this.ctx.fillRect(row * this.TILE_SIZE + 1,
                col * this.TILE_SIZE + 1,
                this.TILE_SIZE - 1,
                this.TILE_SIZE - 1)
            
            this.ctx.strokeStyle = strokeStyle
            this.ctx.strokeRect(row * this.TILE_SIZE + this.HALF_PIXEL,
                col * this.TILE_SIZE + this.HALF_PIXEL,
                this.TILE_SIZE,
                this.TILE_SIZE)
        },

        selectTile: function(e) {

            var row = parseInt(e.x / this.TILE_SIZE, 10), 
                col = parseInt(e.y / this.TILE_SIZE, 10)

            console.log('selectedTile: ' + row + ', ' + col)

            if(typeof this.selectedTile.row === "number") {

                this.drawTile(this.selectedTile.row, this.selectedTile.col, 
                    this.unselectedTile.fillStyle, this.unselectedTile.strokeStyle)

            }

            this.selectedTile.row = row
            this.selectedTile.col = col

            this.highlightedTile.row = null
            this.highlightedTile.col = null

            this.drawTile(this.selectedTile.row, this.selectedTile.col, 
                this.selectedTile.fillStyle, this.selectedTile.strokeStyle)
        
        },

        highlightTile: function(e) {

            //console.log('highlightTile: [raw.x: ' + e.x + ', raw.y: ' + e.y + ']')
            //var p = this.cartesian2DToIsometric({ x: e.x, y: e.y })
            //console.log('highlightTile: [iso.x: ' + p.x + ', iso.y: ' + p.y + ']')
            var row = parseInt(e.x / this.TILE_SIZE, 10), 
                col = parseInt(e.y / this.TILE_SIZE, 10)

            // console.log('highlightedTile: [row: ' + row + ', col: ' + col)

            if(typeof this.highlightedTile.row === "number") {

                this.drawTile(this.highlightedTile.row, this.highlightedTile.col, 
                    this.unselectedTile.fillStyle, this.unselectedTile.strokeStyle)

            }

            if(typeof this.selectedTile.row === "number" &&
                row === this.selectedTile.row && col === this.selectedTile.col) {
                return;
            }

            this.highlightedTile.row = row
            this.highlightedTile.col = col

            this.drawTile(this.highlightedTile.row, this.highlightedTile.col, 
                this.highlightedTile.fillStyle, this.highlightedTile.strokeStyle)
        },

        handleEvent: function(type, e) {

            switch(type) {
                
                case this.EventTypeEnum.CLICK:
                    this.selectIsoTile(e)
                    break;

                case this.EventTypeEnum.MOVE:
                    this.highlightIsoTile(e)
                    break;

                case this.EventTypeEnum.LEFT:
                    this.moveViewport(this.TILE_SIZE, 0)
                    break;
                
                case this.EventTypeEnum.RIGHT:
                    this.moveViewport(-this.TILE_SIZE, 0)
                    break;

                default:
                    break;
            }

        }

    }


    var init = function() {
        
        canvas = document.createElement('canvas')
        canvas.width = 640
        canvas.height = 480
        canvas.id = 'canvas2d'

        if(document.getElementById('canvas2d') == null) {
            document.body.appendChild(canvas)

            game.init(canvas)
        }

    }

    
    init()

    return o

}(TACTICAL || {}))