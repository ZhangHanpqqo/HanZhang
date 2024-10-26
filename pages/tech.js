let spots = [];
let limit = 7;
let particles = [];
let blocks = [];
let block_count = 0;
let img;
let img_pos = [];

const images = [
    {index: 0, path: "../assets/img_art/bio_artist.JPG", name: "bio", associate:[]},
    {index: 1, path: "../assets/img_art/improv.JPG", name: "improv",  associate:[]},
    {index: 2, path: "../assets/img_art/floating.jpg", name: "floating",  associate:[]},           
    {index: 3, path: "../assets/img_art/woyuekan.JPG", name: "woyuekan",  associate:[]},           
    {index: 4, path: "../assets/img_art/LNT.JPG", name: "LNT",  associate:[]},               
    {index: 5, path: "../assets/img_art/learn2move.JPG", name: "L2M",  associate:[6]},        
    {index: 6, path: "../assets/img_art/cycle2learn.JPG", name: "C2L",  associate:[5]},        
    {index: 7, path: "../assets/img_art/anna-wood.jpg", name: "wood",  associate:[]},         
    {index: 8, path: "../assets/img_art/umbilical_cord.jpg", name:"umbilical",  associate:[]}    
];

///// SETUP
function setup() {
    background(0);
    var canvas = document.getElementById('doodle')
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    var ctx = canvas.getContext('2d')
    ctx.beginPath()
    ctx.lineWidth = 2
    ctx.strokeStyle = 'white'
    
    // draw the mondrian shape
    var xPad = Math.floor(canvas.width * 0.1)
    var yPad = Math.floor(canvas.height * 0.1)
    
    var initialRect = new Rectangle(new Point(0, 0), new Point(canvas.width, canvas.height))
    
    // draw the mondrain grid
    initialRect.split(xPad, yPad, 0, limit, ctx)
    ctx.stroke()
    
    // fill in the images
    createCanvas(window.innerWidth,window.innerHeight)
    addImage(images);
    print(img_pos)
    
}

function addImage(){
    images.forEach((element, index) => {
        loadImage(element.path, (img) => imgHandler(img, element.name));
    } 
    );
    // for (var i = 0; i<images.length; i++){
    //     loadImage(images[i].path, (img) => imgHandler(img, i));
    // }
    
}

function imgHandler(img, n){
    // find the most compatible block
    var img_ratio = img.height / img.width;
    var best_b_ratio = 1000;
    var best_b_ind=0;
    var best_b_rec;
    var found_flag = 0;
    for(var i = 0; i<blocks.length-1;i++){
        if ((1 - img_ratio) * (1 - blocks[i].ratio) >= 0){
            found_flag = 1;
            if (Math.abs(1 - img_ratio/blocks[i].ratio) < best_b_ratio){
                best_b_ratio = Math.abs(1 - img_ratio/blocks[i].ratio);
                best_b_ind = i;
                best_b_rec = blocks[i].rec;
            }
        }
        if(found_flag == 0){
            if (Math.abs(1 - img_ratio/blocks[i].ratio) < best_b_ratio){
                best_b_ratio = Math.abs(1 - img_ratio/blocks[i].ratio);
                best_b_ind = i;
                best_b_rec = blocks[i].rec;
            }
        }
    }

    // draw the image on canvas
    image(img, best_b_rec.min.x+1, best_b_rec.min.y+1, Math.abs(best_b_rec.max.x-best_b_rec.min.x)-2, Math.abs(best_b_rec.max.y-best_b_rec.min.y)-2);
    
    // remove that block from the list
    blocks.splice(best_b_ind, 1);
    
    // record the real position of the image
    img_pos.push({name: n, pos: [best_b_rec.min.x+1, best_b_rec.min.y+1, best_b_rec.max.x-1, best_b_rec.max.y-1]})
}



function randInt (min, max) {
    return Math.floor(Math.random() * (max - min) + min)
  }
  
class Point {
    constructor (x, y) {
      this.x = x
      this.y = y
    }
}
  
  
class Rectangle {
    constructor (min, max) {
      this.min = min
      this.max = max
    }
  
    get width () {
      return this.max.x - this.min.x
    }
  
    get height () {
      return this.max.y - this.min.y
    }
  
    draw (ctx) {
      // Draw clockwise
      ctx.moveTo(this.min.x, this.min.y)
      ctx.lineTo(this.max.x, this.min.y)
      ctx.lineTo(this.max.x, this.max.y)
      ctx.lineTo(this.min.x, this.max.y)
      ctx.lineTo(this.min.x, this.min.y)
    }

    draw_in_particles(){
        createParticles(this.min.x, this.min.y, this.max.x, this.min.x);
        createParticles(this.min.x, this.min.y, this.min.x, this.max.x);
        createParticles(this.max.x, this.min.y, this.max.x, this.max.x);
        createParticles(this.min.x, this.max.y, this.max.x, this.max.x);
    }

    save_block(i){
        blocks.push({index: i, rec: this, ratio: Math.abs((this.max.y - this.min.y)/(this.max.x - this.min.x))})
    }
  
    split (xPad, yPad, depth, limit, ctx) {
        this.draw(ctx)
        // this.draw_in_particles(ctx)
        
  
      // Check the level of recursion
      if (depth === limit) {
        this.save_block(block_count)
        block_count++
        return
      }
  
      // Check the rectangle is enough large and tall
      if (this.width < 2 * xPad || this.height < 2 * yPad) {
        this.save_block(block_count)
        block_count++
        return
      }

      
  
      // If the rectangle is wider than it's height do a left/right split
      var r1 = new Rectangle()
      var r2 = new Rectangle()
      if (this.width > this.height) {
        var x = randInt(this.min.x + xPad, this.max.x - xPad)
        r1 = new Rectangle(this.min, new Point(x, this.max.y))
        r2 = new Rectangle(new Point(x, this.min.y), this.max)
      // Else do a top/bottom split
      } else {
        var y = randInt(this.min.y + yPad, this.max.y - yPad)
        r1 = new Rectangle(this.min, new Point(this.max.x, y))
        r2 = new Rectangle(new Point(this.min.x, y), this.max)
      }
  
      // Split the sub-rectangles
      r1.split(xPad, yPad, depth + 1, limit, ctx)
      r2.split(xPad, yPad, depth + 1, limit, ctx)
    }
}

// attempts for particles
// class Particle {
//     constructor(x, y, s) {
//         this.x = x;
//         this.y = y;
//         this.size = Math.random() * s + 2; // Random particle size
//         this.color = 'white';
//     }

//     update() {
//         // You can add behaviors like movement or fading here
//     }

//     draw(ctx) {
//         ctx.fillStyle = this.color;
//         ctx.beginPath();
//         ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
//         ctx.fill();
//     }
// }

// function createParticles(startX, startY, endX, endY) {
//     let len = Math.abs(endX - startX) + Math.abs(endY - startY);
//     let i = 0;
//     let d = 10;
//     while (i * d <= len) {
//         if(endX == startX){
//             let y = startY + d * i;
//             particles.push(new Particle(startX, y, 1)); // Create a new particle at computed position
//         }
//         else{
//             let x = startX + d * i;
//             particles.push(new Particle(x, startY, 1));
//         }
//         i++;
//     }
// }

// function draw_particles(ctx) {
//     for (let particle of particles) {
//         particle.update(); // Update particle properties if needed
//         particle.draw(ctx); // Draw each particle
//     }
// }




// function loadTileImg(img_path) {
//     img_path.forEach((path, index) => {
//         var img = loadImage(path);

//         // find the most compatible block
//         var img_ratio = img.height / img.width;
//         var best_b_ratio = 10;
//         var best_b_ind;
//         var best_b_rec;
//         blocks.forEach((b) => {
//             if (Math.abs(1 - img_ratio/b.ratio) < best_b_ratio){
//                 best_b_ind = b.index;
//                 best_b_rec = b.rec;
//             }
//         });

//         // load the image to the designated location
//         mirrorImage(img, img.width, img.height, Math.abs(best_b_rec.max.x-best_b_rec.min.x), Math.abs(best_b_rec.max.y-best_b_rec.min.y))

//         // need to pop this rectangle out of the block list
//         blocks.splice(best_b_ind, 1);


//     });
// }

// function mirrorImage(img, x, y, w, h) {
//     for (let i = x; i < x + w; i += x) {
//         for (let j = y; j < y + h; j += y) {
//             // Save the current transformation state
//             push();
            
//             // Calculate the position to translate to
//             translate(i, j);
            
//             // Determine mirroring based on position
//             if ((i / x) % 2 === 1) scale(-1, 1); // Flip horizontally
//             if ((j / y) % 2 === 1) scale(1, -1); // Flip vertically
            
//             // Draw the image
//             image(img, w, h, x, y);
            
//             // Restore the transformation state
//             pop();
//         }
//     }
// }

function draw(){
    ///// Draw
    var mouse_hover;

    // detect mouse hover
    for(var i = 0; i < img_pos.length; i++){
        if (mouseX >= img_pos[i].pos[0] && mouseY >= img_pos[i].pos[1] &&
            mouseX <= img_pos[i].pos[2] && mouseY <= img_pos[i].pos[3]
        ){
            mouse_hover = i;
            break;
        }
    }

    if (mouse_hover == null){
        cursor(ARROW);
    }
    else{
        cursor(HAND);

    }



}

function mousePressed(){
    var mouse_click;

    // detect mouse hover
    for(var i = 0; i < img_pos.length; i++){
        if (mouseX >= img_pos[i].pos[0] && mouseY >= img_pos[i].pos[1] &&
            mouseX <= img_pos[i].pos[2] && mouseY <= img_pos[i].pos[3]
        ){
            mouse_click = i;
            break;
        }
    }

    // jump to the corresponding page
    if (mouse_click != null){
        window.location.href = "/pages/art/" + img_pos[i].name + ".html";
    }
    
}

///// Key Control
function keyPressed() {
    if (keyCode === ENTER) {
        window.location.href = "../index.html"; // Replace with desired URL
    }
}