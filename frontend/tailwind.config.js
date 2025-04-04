module.exports = {
    content: ["./src/index.html", "./src/**/*.{ts,js,html}"],
    theme: {
      extend: {},
    },
    variants: {
      extend: {
        backdropBlur: ["responsive"],
        backgroundOpacity: ["responsive"],
      },
    },
    plugins: [],
  };
