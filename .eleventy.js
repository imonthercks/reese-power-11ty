const socialImages = require("@11tyrocks/eleventy-plugin-social-images");
const emojiRegex = require("emoji-regex");
const slugify = require("slugify");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const markdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");
const packageVersion = require("./package.json").version;
const Image = require("@11ty/eleventy-img");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(socialImages);
  eleventyConfig.addPlugin(syntaxHighlight);
  eleventyConfig.addPlugin(pluginRss);

  eleventyConfig.addWatchTarget("./src/sass/");

  eleventyConfig.addPassthroughCopy("./src/css");
  eleventyConfig.addPassthroughCopy("./src/fonts");
  eleventyConfig.addPassthroughCopy("./src/img");
  eleventyConfig.addPassthroughCopy("./src/android-chrome-*.png");
  eleventyConfig.addPassthroughCopy("./src/apple-touch-icon.png");
  eleventyConfig.addPassthroughCopy("./src/favicon.*");
  eleventyConfig.addPassthroughCopy("./src/favicon*.*");
  eleventyConfig.addPassthroughCopy("./src/site.webmanifest");
  eleventyConfig.addPassthroughCopy("./src/scripts");

  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);
  eleventyConfig.addShortcode("packageVersion", () => `v${packageVersion}`);

  eleventyConfig.addFilter("slug", (str) => {
    if (!str) {
      return;
    }

    const regex = emojiRegex();
    // Remove Emoji first
    let string = str.replace(regex, "");

    return slugify(string, {
      lower: true,
      replacement: "-",
      remove: /[*+~·,()'"`´%!?¿:@\/]/g,
    });
  });

  eleventyConfig.addFilter("respectCRLF", (str) => {
    if (!str) {
      return;
    }

    const regex = /\r\n/ig
    return str.replace(regex, "<br />");
  })

  eleventyConfig.addFilter("list", (ul) => {
    const getValue = (listItem_object) => {
      let curr = listItem_object;
      while (curr.nodeType !== "text") {
        curr = curr.content[0];
      }
      return curr.value;
    }

    const ulRender = (ul_object) => {
      return "<ul>" + ul_object.reduce((prev, curr) => {

        let listItems = "";

        if (prev && typeof(prev) === "object"){
          listItems += "<li>" + getValue(prev);
          if (prev.content.length > 1) {
            listItems += "<ul>";
            if (prev.content[1].content.length === 1){
              listItems += "<li>" + getValue(prev.content[1]) + "</li>";
            } else {
              listItems += prev.content[1].content.reduce((prev2, curr2) => {
                let prevListItems = "";
                if (prev2 && typeof(prev2) === "object"){
                  prevListItems += "<li>" + getValue(prev2) + "</li>";
                }
                if (curr2){
                  prevListItems += "<li>" + getValue(curr2) + "</li>";
                }
                return prevListItems;
              });
            }
            listItems += "</ul>";
          }
          listItems += "</li>"
        }
        if (prev && typeof(prev) === "string") {
          listItems += prev
        }
        if (curr) {
          listItems += "<li>" + getValue(curr);
          if (curr.content.length > 1) {
            listItems += "<ul>";
            if (curr.content[1].content.length === 1){
              listItems += "<li>" + getValue(curr.content[1]) + "</li>";
            } else {
              listItems += curr.content[1].content.reduce((prev3, curr3) => {
                let currListItems = "";
                if (prev3 && typeof(prev3) === "object"){
                  currListItems += "<li>" + getValue(prev3) + "</li>";
                }
                if (curr3){
                  currListItems += "<li>" + getValue(curr3) + "</li>";
                }
                return currListItems;
              });
            }
            listItems += "</ul>";
          }
          listItems += "</li>"
        }
        return listItems;
      }) + "</ul>";
    }

    return ulRender(ul);
  })

  eleventyConfig.addNunjucksAsyncShortcode("stringify", async function(json){
    return JSON.stringify(json);
  });

  eleventyConfig.addNunjucksAsyncShortcode("Image", async function(src, alt, outputFormat = "jpeg") {
    if(alt === undefined) {
      // You bet we throw an error on missing alt (alt="" works okay)
      throw new Error(`Missing \`alt\` on Image from: ${src}`);
    }

    let stats = await Image(src, {
      widths: [300],
      formats: [outputFormat],
      urlPath: "/images/",
      outputDir: "./public/images/"
    });
    let props = stats[outputFormat].pop();

    return `<img src="${props.url}" width="${props.width}" height="${props.height}" alt="${alt}">`;
  });

  /* Markdown Overrides */
  let markdownLibrary = markdownIt({
    html: true,
  }).use(markdownItAnchor, {
    permalink: true,
    permalinkClass: "tdbc-anchor",
    permalinkSymbol: "#",
    permalinkSpace: false,
    level: [1, 2, 3],
    slugify: (s) =>
      s
        .trim()
        .toLowerCase()
        .replace(/[\s+~\/]/g, "-")
        .replace(/[().`,%·'"!?¿:@*]/g, ""),
  });
  eleventyConfig.setLibrary("md", markdownLibrary);

  return {
    passthroughFileCopy: true,
    dir: {
      input: "src",
      output: "public",
    },
  };
};
