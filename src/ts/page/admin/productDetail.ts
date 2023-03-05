import { deleteProduct, getDetailProduct } from '../../api';
import { renderDetailProduct } from './renderDetail';
import { $ } from '../../utils/dom';

import { router } from '../../main';

/** 상품관리상세 페이지 핸들러 */
export const handleProductDetailPage = async (
  productId: string,
): Promise<void> => {
  const productDetail = await getDetailProduct(productId);

  renderDetailProduct(productDetail);

  const deleteProductBtn = $<HTMLButtonElement>(
    '.productDetail-container__btn--delete',
  );
  const editProductBtn = $<HTMLButtonElement>(
    '.productDetail-container__btn--edit',
  );

  /** 상품 삭제 이벤트 리스너 */
  deleteProductBtn.addEventListener('click', async () => {
    if (confirm('상품을 삭제하시겠습니까?')) {
      await deleteProduct(productId);
      alert('상품이 삭제되었습니다.');
      router.navigate('/admin/product');
    }
  });

  /** 상품 수정 이벤트 리스너 */
  editProductBtn.addEventListener('click', async () => {
    router.navigate(`/admin/product/edit/${productId}`);
  });
};
