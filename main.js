var TACTICAL = (function(o) {

    var canvas

    var game = {

        ctx: null, 
        WIDTH: 0, 
        HEIGHT: 0, 
        // ROWS: 0, 
        // COLS: 0,
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
            MOVE: 2
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
            // this.ROWS    = 10
            // this.COLS    = 10
            this.TILE_SIZE = 64

            var that = this

            c.onclick = function(e) {
                that.handleEvent.call(that, that.EventTypeEnum.CLICK, { x: e.offsetX, y: e.offsetY })
            }

            c.onmousemove = function(e) {
                that.handleEvent.call(that, that.EventTypeEnum.MOVE, { x: e.offsetX, y: e.offsetY })
            }

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

            // var currentRow = 0, currentColumn = 0
            
            // for(var i=0; i < this.map.length; i += 1) {
                
                // Next row
                // if ( currentRow != parseInt( (i / this.ROWS), 10) ) {
                //     currentRow = parseInt( (i / this.ROWS), 10)
                //     currentColumn = 0    
                // }

                // this.ctx.strokeRect(currentRow * this.TILE_SIZE, 
                //     currentColumn * this.TILE_SIZE,
                //     this.TILE_SIZE, 
                //     this.TILE_SIZE)
                
                // currentColumn += 1

            // }

            // draw vertical lines
            var i = 0,
                p = { x: 0, y: 0 },
                // rows = parseInt(this.HEIGHT / this.TILE_SIZE, 10) * 2,
                // cols = parseInt(this.WIDTH / this.TILE_SIZE, 10) * 2
                rows = 3,
                cols = 3

            // this.ctx.moveTo(this.CENTER_X(), 0)
            // this.ctx.lineTo(this.CENTER_X(), this.HEIGHT)

            // this.ctx.moveTo(0, this.CENTER_Y())
            // this.ctx.lineTo(this.WIDTH, this.CENTER_Y())



            // this.ctx.fillStyle = this.highlightedTile.fillStyle
            // this.ctx.strokeStyle = this.highlightedTile.strokeStyle

            // var x = this.CENTER_X() - this.TILE_SIZE + this.HALF_PIXEL,
            //     y = this.CENTER_Y()

            // this.ctx.fill()

            // this.ctx.beginPath()
            // this.ctx.moveTo(x, y)
            // this.ctx.lineTo(x + this.TILE_SIZE, y - this.TILE_SIZE / 2)
            // this.ctx.lineTo(x + this.TILE_SIZE * 2, y)
            // this.ctx.lineTo(x + this.TILE_SIZE, y + this.TILE_SIZE / 2)
            // this.ctx.closePath() // draws last line of the tile
            // this.ctx.stroke()


            i = 0
            while(i <= this.WIDTH / this.TILE_SIZE)
            {
                this.ctx.moveTo(i * this.TILE_SIZE, 0)
                this.ctx.lineTo(i * this.TILE_SIZE, this.HEIGHT)

                i += 1
            }

            i = 0
            while(i <= this.HEIGHT / this.TILE_SIZE)
            {
                this.ctx.moveTo(0, i * this.TILE_SIZE)
                this.ctx.lineTo(this.WIDTH, i * this.TILE_SIZE)
                
                i += 1
            }




            // while(i <= cols) {

            //     p = this.cartesian2DToIsometric({ x: i * this.TILE_SIZE + this.HALF_PIXEL, y: 0 })
            //     this.ctx.moveTo(p.x, p.y)

            //     p = this.cartesian2DToIsometric({ x: i * this.TILE_SIZE + this.HALF_PIXEL, y: rows * this.TILE_SIZE })
            //     this.ctx.lineTo(p.x, p.y)

            //     i += 1

            // }

            // draw horizontal lines
            i = 0
            while(i <= cols) {
                o = { x: (this.CENTER_X() + (i * this.TILE_SIZE - (cols * this.TILE_SIZE) / 2)) + this.HALF_PIXEL, y: (this.CENTER_Y() - (rows * this.TILE_SIZE) / 2) + this.HALF_PIXEL }
                console.log(o)
                p = this.cartesian2DToIsometric(o)
                console.log(p)
                this.ctx.moveTo(p.x + this.CENTER_X(), p.y)

                
                p = this.cartesian2DToIsometric({ x: (this.CENTER_X() + (i * this.TILE_SIZE - (cols * this.TILE_SIZE) / 2)) + this.HALF_PIXEL, y: (this.CENTER_Y() + (rows * this.TILE_SIZE) / 2) + this.HALF_PIXEL } )
                this.ctx.lineTo(p.x, p.y)
                
                i += 1

            }

            this.ctx.stroke()

        },

        drawTile: function(row, col, fillStyle, strokeStyle) {

            this.ctx.fillStyle = fillStyle
            // this.ctx.fillRect(row * this.TILE_SIZE + 1,
            //     col * this.TILE_SIZE + 1,
            //     this.TILE_SIZE - 1,
            //     this.TILE_SIZE - 1)
            
            this.ctx.strokeStyle = strokeStyle
            // this.ctx.strokeRect(row * this.TILE_SIZE + this.HALF_PIXEL,
            //     col * this.TILE_SIZE + this.HALF_PIXEL,
            //     this.TILE_SIZE,
            //     this.TILE_SIZE)

            var x = row * this.TILE_SIZE + this.HALF_PIXEL,
                y = col * this.TILE_SIZE + this.HALF_PIXEL

            this.ctx.fill()

            this.ctx.beginPath()
            this.ctx.moveTo(x, y)
            this.ctx.lineTo(x + this.TILE_SIZE, y - this.TILE_SIZE / 2)
            this.ctx.lineTo(x + this.TILE_SIZE * 2, y)
            this.ctx.lineTo(x + this.TILE_SIZE, y + this.TILE_SIZE / 2)
            this.ctx.closePath() // draws last line of the tile
            this.ctx.stroke()

        },

        selectTile: function(e) {

            var p = this.cartesian2DToIsometric({ x: e.x, y: e.y })
            var row = parseInt(p.x / this.TILE_SIZE, 10), 
                col = parseInt(p.y / this.TILE_SIZE, 10)

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
                    this.selectTile(e)
                    break;

                case this.EventTypeEnum.MOVE:
                    //this.highlightTile(e)
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