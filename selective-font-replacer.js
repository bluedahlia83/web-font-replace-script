// ==UserScript==
// @name         Selective Font Replacer
// @namespace    local
// @version      1.1.1
// @description  대상 폰트를 유니코드 기반 문자별 폰트 분할해서 교체
// @author       bluedahlia83
// @match        *://*/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  /* ==========================================
   * [설정] 교체 대상 폰트 목록
   * ========================================== */
  const targetFonts = [
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
  ];

  /* ==========================================
   * CSS 및 @font-face 생성
   * ========================================== */
  function getTemplate(font) {
    return `
      /* 1. 알파벳 */
      @font-face {
        font-family: "${font}";
        src:
          local("Ubuntu-R"),
          local("Ubuntu");
        unicode-range:
          U+0000-002F,
          U+003A-00FF;
      }
      /* 2. 숫자 및 일본어 */
      @font-face {
        font-family: "${font}";
        src:
          local("migu-1c-regular"),
          local("Migu 1C Regular");
        unicode-range:
          U+0030-0039,        /* 숫자 */
          U+3000-303F,        /* CJK 기호 및 구두점 */
          U+3040-309F,        /* 히라가나 */
          U+30A0-30FF,        /* 가타카나 */
          U+31F0-31FF,        /* 가타카나 음성 확장 */
          U+3400-4DBF,        /* CJK 통합 한자 확장 A */
          U+4E00-9FFF,        /* CJK 통합 한자 */
          U+F900-FAFF,        /* CJK 호환 한자 */
          U+FF00-FFEF;        /* 반각 및 전각 문자 */
      }
      /* 3. 한글 */
      @font-face {
        font-family: "${font}";
        src:
          local("Noto-Sans-KR"),
          local("Noto Sans KR");
        unicode-range:
          U+1100-11FF,        /* 한글 자모 */
          U+3130-318F,        /* 한글 호환 자모 */
          U+A960-A97F,        /* 한글 자모 확장-A */
          U+AC00-D7AF,        /* 한글 음절 */
          U+D7B0-D7FF;        /* 한글 자모 확장-B */
      }
    `;
  }

  let cssRules = "";
  targetFonts.forEach((font) => {
    cssRules += getTemplate(font);
  });

  /* ==========================================
   * sans-serif만 설정된 페이지 대응 (가상 조합 폰트 스택)
   * - 고유의 조합 폰트 패밀리("MixedCJK")를 정의하고,
   *   폰트가 구체적으로 지정되지 않은 일반 영역에 적용합니다.
   * ========================================== */
  cssRules += getTemplate("MixedCJK");
  cssRules += `
    body {
        font-family: "MixedCJK", sans-serif;
    }
  `;

  /* ==========================================
   * 스타일 최우선 주입 (document-start)
   * ========================================== */
  const styleElement = document.createElement("style");
  styleElement.type = "text/css";
  styleElement.appendChild(document.createTextNode(cssRules));

  if (document.documentElement) {
    document.documentElement.appendChild(styleElement);
  } else {
    document.addEventListener("DOMContentLoaded", () => {
      document.documentElement.appendChild(styleElement);
    });
  }
})();
