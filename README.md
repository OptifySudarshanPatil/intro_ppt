# PPT Style Website

A simple fullscreen presentation-style website with scroll navigation.

## Features

- 📺 Fullscreen slides with smooth transitions
- 🖱️ Mouse wheel scroll navigation
- 📱 Touch/swipe support for mobile devices
- ⌨️ Keyboard navigation (Arrow keys, Page Up/Down, Home/End)
- 🎯 Navigation dots for quick slide access
- 🎨 Beautiful gradient backgrounds
- 🏁 Footer indicator on the last slide

## How to Use

1. **Scroll** with your mouse wheel to navigate between slides
2. **Swipe** on touch devices
3. **Use keyboard**: Arrow keys, Page Up/Down, Home/End
4. **Click navigation dots** on the right side to jump to specific slides

## Customization

### Adding More Slides

Edit [index.html](index.html) and add new slide sections:

```html
<section class="slide" data-slide="6">
    <div class="content">
        <h1>Your Title</h1>
        <p>Your content</p>
    </div>
</section>
```

### Changing Colors

Edit [styles.css](styles.css) and modify the gradient backgrounds:

```css
.slide[data-slide="6"] {
    background: linear-gradient(135deg, #color1 0%, #color2 100%);
}
```

## GitHub Pages Deployment

1. Push this repository to GitHub
2. Go to repository Settings
3. Navigate to Pages section
4. Select your branch (usually `main`)
5. Save and wait for deployment
6. Your site will be live at: `https://[username].github.io/[repository-name]`

## Files Structure

- `index.html` - Main HTML structure with slides
- `styles.css` - All styling and animations
- `script.js` - Navigation logic and interactions
- `README.md` - This file

## Browser Support

Works on all modern browsers including:
- Chrome/Edge
- Firefox
- Safari
- Mobile browsers

Enjoy your presentation website! 🚀
