/** skeleton UI */
export const renderSkeletonUI = (
  template: string,
  skeletonNum: number,
  location: any,
): void => {
  const skeletonUITemplate: string = `
    ${template}
  `;

  const skeletonUI: string = Array(skeletonNum)
    .fill(skeletonUITemplate)
    .map((v: string) => {
      return v;
    })
    .join('');

  location.innerHTML = skeletonUI;
};

/** [제품 상세페이지] skeleton ui 초기 렌더링 템플릿 */
export const skeletonUITemplateProductDetail: string = `
    <div class="productDetail__skeleton--container">
      <div class="productDetail__skeleton--img"></div>
      <div class="productDetail__skeleton--aside">
        <div class="productDetail__skeleton--aside-desc"></div>
        <div class="productDetail__skeleton--aside-desc"></div>
        <div class="productDetail__skeleton--aside-desc"></div>
        <div class="productDetail__skeleton--aside-desc"></div>
      </div>
    </div>
`;

/** [카테고리 페이지] skeleton ui 초기 렌더링 템플릿 */
export const skeletonUITemplateCategoryPage: string = `
<li class="categoryPage__skeleton">
  <div class="categoryPage__skeleton--img"></div>
  <div class="categoryPage__product--info">
    <h3 class="categoryPage__skeleton--title"></h3>
  </div>
</li>
`;

/** [상세 주문 내역 페이지] [주문 내역 페이지] skeleton ui 초기 렌더링 */
export const skeletonUITemplateDetailOrderHistoryPage: string = `
  <li class="orderHistoryPage__skeleton"></li>
`;
