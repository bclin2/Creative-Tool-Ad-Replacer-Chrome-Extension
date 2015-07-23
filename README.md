# Creative Tool Ad Replacer
The purpose of this Chrome extension is to improve productivity for anyone who needs to modify elements on a web page and take screenshots of them. It will also replace video ads from video players. 

# Installation
It is currently unlisted in the Chrome Webstore; please contact me for the URL. Or you could just pull it down and install it manually if you want to try it out. 

Once you have the url, simply click the "add to chrome button", and you've finished installing it! 

If you choose to pull it down, you will have to manually install the unpackaged chrome extension into your browser. 

Once you've pulled it down, type "chrome://extensions" without quotes into the address bar of your browser. 

Near the top left, you will see the button with the words "Load unpacked extension". Click on it, and upload the folder you've just pulled down.

Enable your extension, and now you're done! 

# How to use it
## Image Div Replacer
In order to activate the tool, click on the "CT" icon on the top right of your browser once you have installed it. Then, click on the Images button.

When you move your mouse over an element on the webpage, the element is highlighted with a yellow overlay.  

If you target a smaller element, but you want the overlay to cover a larger area, you can press the Up Arrow key. This will cause the overlay to move to the selected element's parents. 

Dragging an image file or a text file containing tags from your desktop to the overlay will replace the selected element with your image/tags. 

In order to close the overlay, click on the "X" button on the top right of the overlay. 
In order to open up the paste option, click on the "P" button on the top right of the overlay. This will open up an prompt dialog where you can paste your tags. 

Paste any tags you have on your clipboard into the text area and click "Okay". This will replace the selected element with your tags. 

Notes: Images or tags may not fit correctly if they are not already tailored to fit the selected element. 

## Video Ad Replacer Toggle
The Video Ad Replacer does what it sounds like it does. When activated, it will replace a video player's ads with the users own ads. 

To activate it, click on the "CT" icon on the top. Then, click on the video toggle. This will trigger a window prompt. A icon badge will appear near the "CT" icon, letting you know if the video is toggled on or off. 

Paste a VAST XML response URL into the text area, and click OK. 
This will refresh the page. Any video player that uses a VAST request for ads will now play the ads that you specified^. 

To turn the toggle off, simply click on the "CT" icon on the top right of the browser, then click on the video toggle once more. 

Notes: ^There are some websites that don't take VAST, though these are rare. Not all of the ad servers have been identified, so on rare occasion, the ads will not be replaced. For websites with HTTPS, you can only replace the video ads if you have a VAST response URL with HTTPS. 

