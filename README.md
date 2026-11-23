# 🔌 Morse Code PCB Visualizer

<div align="center">
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5">
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3">
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript">
  <img src="https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge" alt="License">
</div>

<div align="center">
  <p><em>Learn the Morse alphabet on a glowing circuit board: each letter keyed out in light and sound, at the speed you choose.</em></p>
  <p><strong><a href="https://dimitry4now.github.io/morse-visualization/">Try it live</a></strong></p>
</div>

![The visualizer after sending A: the letter revealed above its dot and dash](docs/screenshot.png)

## ✨ What it does

- **Keys every letter A–Z**, round the alphabet: the code plays first, then the letter is revealed, so you can try to read it before it appears.
- **Light and sound together**: each dot or dash lights up for exactly as long as its tone plays, then stays dimly lit, so the letter's pattern builds up as it is sent.
- **One tone, like a real key**: 650 Hz for dots and dashes alike, with soft edges so it doesn't click. Dots and dashes differ only in length.
- **Speed in words per minute**: 5–25 WPM, changeable while it plays.
- **Keyboard**: Space starts and pauses, R resets.
- **Works on a phone** as well as on a desktop. No dependencies, no build step.

## ⏱️ Timing

Morse is counted in units. At *W* words per minute one unit lasts 1200 / *W* ms, the standard "PARIS" definition (120 ms at 10 WPM).

| | Units |
|---|---|
| Dot | 1 |
| Dash | 3 |
| Gap between the dots and dashes of a letter | 1 |
| Letter shown before its code | 2 |
| Pause after a letter | 7 |

The pause after a letter is longer than the standard 3 units on purpose: learners get the letters at full speed but more time between them (Farnsworth spacing), which is how Morse is usually taught.

## 🚀 Running it

It's one static page: open `index.html` in a browser, or serve the folder (`python3 -m http.server 8000`). The live version is on GitHub Pages, from the `master` branch.

```bash
git clone https://github.com/Dimitry4Now/morse-visualization.git
```

## 🎯 Learning tips

1. Start slow (5–8 WPM) and turn the sound on: Morse is learned by ear.
2. Try to name each letter before it's revealed.
3. Pause (Space) to stay on a letter that keeps catching you out.
4. Speed up a step at a time once a speed feels easy.

## 💡 Ideas

- [ ] Numbers (0–9) and punctuation
- [ ] Custom text input
- [ ] Prosigns (procedural signals)
- [ ] Quiz mode with score tracking
- [ ] Different color themes

## 📄 License

MIT, see [LICENSE](LICENSE).

## 📞 Support

- 🐛 **Bug reports**: [open an issue](https://github.com/Dimitry4Now/morse-visualization/issues)
- 📧 **Contact**: dimitarbetinski@gmail.com

---

<div align="center">
  <p><strong>Happy learning! 📡 ··· --- ···</strong></p>
</div>
