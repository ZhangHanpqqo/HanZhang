let spots = [];
let limit = 10;
let particles = [];
let blocks = [];
let block_count = 0;
let img;
let img_pos = [];
let hover_shadow;
let hover_border;

let images = [
    {index: 0, path: "../assets/img_art/bio_artist.JPG", name: "bio", full: "Artist Bio", associate:[]},
    // {index: 1, path: "../assets/img_art/improv.JPG", name: "improv", full: "improvisation", associate:[]},
    {index: 2, path: "../assets/img_art/floating.jpg", name: "floating", full: "nobody thus everybody floating in the air (2023)", associate:[9]},           
    {index: 3, path: "../assets/img_art/woyuekan.JPG", name: "woyuekan", full:"我越看你越像一个人 (2023)", associate:[]},           
    // {index: 4, path: "../assets/img_art/LNT.JPG", name: "LNT", full: "Leave No Trace (2023)", associate:[]},               
    {index: 5, path: "../assets/img_art/learn2move.jpg", name: "L2M", full: "Learning to Move, Learning to Play, Learning to Animate (2024)", associate:[6]},        
    {index: 6, path: "../assets/img_art/cycle2learn.JPG", name: "C2L", full: "Cycle to Learn (2024)", associate:[5]},        
    {index: 7, path: "../assets/img_art/anna-wood.jpg", name: "wood", full: "woooowaaadiiiiterrrrr (2024) - āññā duo", associate:[12, 13]},         
    {index: 8, path: "../assets/img_art/umbilical_cord.jpg", name:"umbilical", full: "Umbilical Cord (2024)", associate:[11]} ,
    {index: 9, path: "../assets/img_art/me_hiciste_falta.png", name:"falta", full: "Me Hiciste Falta (2024)", associate:[2]},
    {index: 10, path: "../assets/img_art/no_input_dev.jpg", name:"tam", full: "No Input Dev (2025)", associate:[]},
    {index: 11, path: "../assets/img_art/Loom.jpg", name:"loom", full:"Loom (2025)", associate:[8]},
    {index: 12, path: "../assets/img_art/dedim.jpeg", name:"dedim", full:"De-dimension (2025) - āññā duo", associate: [7,13]},
    {index: 13, path: "../assets/img_art/tpwi.png", name: "tpwi", full:"The Particles We Immersed (2025) - āññā duo", associate: [7, 12]},
    {index: 14, path: "../assets/img_art/(<e>).jpg", name: "e", full:"(<e>) (2025) - Theegma duo", associate: [15]},
    {index: 15, path: "../assets/img_art/0=).jpg", name:"0", full:"0二二二二二) (2025) - Theegma duo", associate: [14]}
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

    // create the shadow for the picture that the mouse hovers on
    hover_shadow = document.getElementById('hover_shadow');
    hover_border = document.getElementById('hover_border');
    hover_border.style.backgroundColor='transparent'
    
}

function addImage(){
    images.forEach((element, index) => {
        loadImage(element.path, (img) => imgHandler(img, element.index, element.name, element.full, element.associate));
    } 
    );
    // for (var i = 0; i<images.length; i++){
    //     loadImage(images[i].path, (img) => imgHandler(img, i));
    // }
    
}

function imgHandler(img, ind, n, f, a){
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
    var disW, disH; // display width and height for the image
    rec_ratio = (best_b_rec.max.y - best_b_rec.min.y) / (best_b_rec.max.x - best_b_rec.min.x)
    print(img_ratio, rec_ratio)
    if (img_ratio > rec_ratio){
        disH = best_b_rec.max.y - best_b_rec.min.y;
        disW = int(disH / img_ratio - 2.5);
        disH = int(disH) - 2;
        // print(disW, disH, best_b_rec.max.x - best_b_rec.min.x, best_b_rec.max.y - best_b_rec.min.y)

    }
    else{
        disW = best_b_rec.max.x - best_b_rec.min.x;
        disH = int(disW * img_ratio - 2.5);
        disW = int(disW) - 2;
    }

    var imgX = best_b_rec.min.x + int((best_b_rec.max.x - best_b_rec.min.x - disW) / 2) + 1;
    var imgY = best_b_rec.min.y + int((best_b_rec.max.y - best_b_rec.min.y - disH) / 2) + 1;
    // image(img, best_b_rec.min.x+1, best_b_rec.min.y+1, Math.abs(best_b_rec.max.x-best_b_rec.min.x)-2, Math.abs(best_b_rec.max.y-best_b_rec.min.y)-2);
    image(img, imgX, imgY, disW, disH);
    drawMirrors(img, imgX, imgY, disW, disH, best_b_rec.min.x+1, best_b_rec.min.y+1, best_b_rec.max.x - best_b_rec.min.x - 2, best_b_rec.max.y - best_b_rec.min.y - 2)
    
    // remove that block from the list
    blocks.splice(best_b_ind, 1);
    
    // record the real position of the image
    img_pos.push({index: ind, name: n, full:f, associate: a, pos: [best_b_rec.min.x+1, best_b_rec.min.y+1, best_b_rec.max.x-1, best_b_rec.max.y-1]})
}


function drawMirrors(img, imgX, imgY, displayWidth, displayHeight, rectX, rectY, rectWidth, rectHeight) {
    // Left mirrored part
    for (var x = rectX; x < imgX; x += 1) {
      var ratio = map(x, rectX, imgX, 255, 0);
      tint(255, 255);
      copy(img, 0, 0, 1, img.height, x, imgY, 1, displayHeight);
    }
  
    // Right mirrored part
    for (var x = imgX + displayWidth; x < rectX + rectWidth; x += 1) {
      var ratio = map(x, imgX + displayWidth, rectX + rectWidth, 0, 255);
      tint(255, 255);
      copy(img, img.width - 1, 0, 1, img.height, x, imgY, 1, displayHeight);
    }
  
    // Top mirrored part
    for (var y = rectY; y < imgY; y += 1) {
      var ratio = map(y, rectY, imgY, 255, 0);
      tint(255, 255);
      copy(img, 0, 0, img.width, 1, imgX, y, displayWidth, 1);
    }
  
    // Bottom mirrored part
    for (var y = imgY + displayHeight; y < rectY + rectHeight; y += 1) {
      var ratio = map(y, imgY + displayHeight, rectY + rectHeight, 0, 255);
      tint(255, 255);
      copy(img, 0, img.height - 1, img.width, 1, imgX, y, displayWidth, 1);
    }
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
        var r = (this.max.y - this.min.y)/(this.max.x - this.min.x)
        blocks.push({index: i, rec: this, ratio: r})
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
    var mouse_hover_pos; 
    var mouse_hover_full_name;
    var mouse_hover_associate;

    // detect mouse hover
    for(var i = 0; i < img_pos.length; i++){
        if (mouseX >= img_pos[i].pos[0] && mouseY >= img_pos[i].pos[1] &&
            mouseX <= img_pos[i].pos[2] && mouseY <= img_pos[i].pos[3]
        ){
            mouse_hover = i;
            mouse_hover_pos = img_pos[i].pos;
            mouse_hover_full_name = img_pos[i].full;
            mouse_hover_associate = img_pos[i].associate;
            break;
        }
    }

    if (mouse_hover == null){
        cursor(ARROW);
        hover_shadow.style.opacity = 0;
        while(hover_border.firstChild){
            hover_border.removeChild(hover_border.firstChild);
        }

    }
    else{
        cursor(HAND);
        hover_trigger(mouse_hover_pos, mouse_hover_full_name, mouse_hover_associate);

    }



}

function hover_trigger(pos, full, associate){
    // pos: [minx, miny, maxx, maxy]

    // hovering triggers the selected rectangle to react
    const center = [(pos[0] + pos[2]) / 2, (pos[1] + pos[3]) / 2]; // center of the 
    const dsquare = Math.abs(mouseX - center[0]) + Math.abs(mouseY - center[1]); // square of distance to center
    const dsquareref = (pos[2] - pos[0]) / 2 + (pos[3] - pos[1]) / 2;
    const opacity = 0.9 - (dsquare / dsquareref);

    hover_shadow.style.left = pos[0].toString() + 'px';
    hover_shadow.style.top = pos[1].toString() + 'px';
    hover_shadow.style.width = (pos[2] - pos[0] - 3).toString() + 'px';
    hover_shadow.style.height = (pos[3] - pos[1] - 3).toString() + 'px';
    hover_shadow.style.opacity = opacity;

    hover_shadow.innerText = full;

    // Create shadows on associate projects
    while(hover_border.firstChild){
        hover_border.removeChild(hover_border.firstChild);
    }
    for(var i=0; i < associate.length; i++){
        
        var sa = document.createElement('div');
        sa.classList.add('shadow');
        sa.style.opacity = opacity;
        
        for(var j=0; j<img_pos.length; j++){
            if (img_pos[j].index == associate[i]){
                print(img_pos[j].pos)
                sa.style.left = (img_pos[j].pos[0]).toString() + 'px';
                sa.style.top = (img_pos[j].pos[1]).toString() + 'px';
                sa.style.width = (img_pos[j].pos[2] - img_pos[j].pos[0] - 3).toString() + 'px';
                sa.style.height = (img_pos[j].pos[3] - img_pos[j].pos[1] - 3).toString() + 'px';
                break;
                
            }
        }

        hover_border.appendChild(sa);
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
        if (img_pos[i].index == 12) {
            window.open("https://annaduo.pro/pages/ddm.html", "_blank");
        }
        else{
            window.location.href = "./art/" + img_pos[i].name + ".html";
        }
    }
    
}

///// Key Control
function keyPressed() {
    if (keyCode === ENTER) {
        window.location.href = "../index.html"; // Replace with desired URL
    }
}
