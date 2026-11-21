// ==UserScript==
// @name         Selective Font Replacer
// @namespace    local
// @version      1.1.3
// @description  대상 폰트를 유니코드 기반 문자별 폰트 분할해서 교체
// @author       bluedahlia83
// @match        *://*/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

"use strict";

const CONFIG = {
  fallbackFamily: "MixedCJK",
  targetFonts: [
    "Yu Gothic",
    "Yu Gothic Medium",
    "游ゴシック",
    "游ゴシック Medium",
    "Segoe UI",
    "Roboto",
    "Arial",
    "Helvetica",
    "Tahoma",
    "Verdana",
    "Apple SD Gothic Neo",
    "Meiryo",
    "メイリオ",
    "새굴림",
    "돋움",
    "돋움체",
    "Dotum",
    "DotumChe",
    "굴림",
    "굴림체",
    "Gulim",
    "GulimChe",
    "바탕",
    "바탕체",
    "Batang",
    "BatangChe",
    "맑은 고딕",
    "malgun",
    "Malgun Gothic",
    "SpotifyMixUI",
  ],
  segments: [
    // 1. 알파벳 및 기본 구두점
    {
      locals: ["Ubuntu-R", "Ubuntu"],
      unicodeRange: "U+0000-002F, U+003A-00FF",
    },
    // 2. 숫자 및 CJK/일본어
    {
      locals: ["migu-1c-regular", "Migu 1C Regular"],
      unicodeRange: [
        "U+0030-0039", // 숫자
        "U+3000-303F", // CJK 기호 및 구두점
        "U+3040-309F", // 히라가나
        "U+30A0-30FF", // 가타카나
        "U+31F0-31FF", // 가타카나 음성 확장
        "U+3400-4DBF", // CJK 통합 한자 확장 A
        "U+4E00-9FFF", // CJK 통합 한자
        "U+F900-FAFF", // CJK 호환 한자
        "U+FF00-FFEF", // 반각 및 전각 문자
      ].join(", "),
    },
    // 3. 한글
    {
      locals: ["Noto-Sans-KR", "Noto Sans KR"],
      unicodeRange: [
        "U+1100-11FF", // 한글 자모
        "U+3130-318F", // 한글 호환 자모
        "U+A960-A97F", // 한글 자모 확장-A
        "U+AC00-D7AF", // 한글 음절
        "U+D7B0-D7FF", // 한글 자모 확장-B
      ].join(", "),
    },
  ],
};

function buildFontFaceRules(fontFamily, segments) {
  return segments
    .map(({ locals, unicodeRange }) => {
      const srcList = locals.map((name) => `local("${name}")`).join(", ");
      return `@font-face { font-family: "${fontFamily}"; src: ${srcList}; unicode-range: ${unicodeRange}; }`;
    })
    .join("\n");
}

function buildStylesheet({ targetFonts, fallbackFamily, segments }) {
  const families = [...targetFonts, fallbackFamily];
  const fontFaceCss = families.map((font) => buildFontFaceRules(font, segments)).join("\n");

  const bodyFallbackCss = `body { font-family: "${fallbackFamily}", sans-serif; }`;

  return `${fontFaceCss}\n${bodyFallbackCss}`;
}

function appendToRoot(styleEl) {
  if (!document.documentElement) {
    return false;
  }
  if (!document.getElementById(styleEl.id)) {
    document.documentElement.appendChild(styleEl);
  }
  return true;
}

function injectStyle(cssText) {
  const styleEl = document.createElement("style");
  styleEl.id = "selective-font-replacer-style";
  styleEl.textContent = cssText;

  if (appendToRoot(styleEl)) return;

  const observer = new MutationObserver(() => {
    if (appendToRoot(styleEl)) {
      observer.disconnect();
    }
  });
  observer.observe(document, { childList: true, subtree: true });

  document.addEventListener(
    "DOMContentLoaded",
    () => {
      observer.disconnect();
      appendToRoot(styleEl);
    },
    { once: true },
  );
}

injectStyle(buildStylesheet(CONFIG));
