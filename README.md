Author: Vedant Jadhav [vedantjadhav@arizona.edu]  
Course: Grad 533
Date: February 5, 2025

**PLEASE UPDATE THIS README TO INCLUDE:**
* a text description of how to run your program, 
* document any idiosyncrasies, behaviors, or bugs of note that you want us to be aware of when grading, and
* any other comments that you feel are relevant.

Executing program:

1. To execute the program, open the `index.html` file in the browser.
2. Choose an image by clicking on the `Browse...` button. The images are located in the same directory.
3. The animation should be rendered and begin rotating.

Description:

This is a graphics assignment, where we upload a file to the browser, and the program rotates the image.
The canvas is re-adjusted from the initial window length to 600 x 600 pixels resolution, as mentioned in the assignment text.

**Behavior** -

The image will start rotating in the browser and scale down/up based on the angle and position within the canvas to account for
the corners to be always within the bounds. One weird behavior that can be flagged is, if the image is rectangular, the rotation
might "appear" jittery where it might seem the image is about to grow but shrinks and then growth (scale up) cycle starts.

This is not jittery, but rather it scales properly to account for corner accomodation. This happens with rectangular images where
width to height ratio is greater than 1 and is more noticeable with greater ratio.



Included files (**PLEASE ADD/UPDATE THIS LIST**):
* index.html            -- a sample html file with a canvas
* a01.js                -- a sample javascript file for functionality with the image uploading, and a method to parse PPM images
* MathUtilities.js		-- some math functions that you can use and extend yourself. It contains matrix manipulations
* bunny.ppm             -- a test image
* pic1.ppm              -- another test image


**PLEASE PROVIDE ANY ATTRIBUTION HERE**
* Images obtained from the following sources:
  * bunny: http://graphics.stanford.edu/data/3Dscanrep/  
  * pic1:  https://www.cs.cornell.edu/courses/cs664/2003fa/images/
