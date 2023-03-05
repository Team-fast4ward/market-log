import { editProduct, getDetailProduct } from '../../api';
import { renderEditProduct } from './renderDetail';
import { $ } from '../../utils/dom';

import { router } from '../../main';

/** 상품수정 페이지 핸들러 */
export const handleProductEditPage = async (
  productId: string,
): Promise<void> => {
  const product = await getDetailProduct(productId);

  $('.productEdit-container').insertAdjacentHTML(
    'afterbegin',
    renderEditProduct(product),
  );

  const titleInput = $<HTMLInputElement>(
    '.container-form__content--title input',
  );
  const priceInput = $<HTMLInputElement>(
    '.container-form__content--price input',
  );
  const desciptionInput = $<HTMLTextAreaElement>(
    '.container-form__content--description textarea',
  );
  const tagsSelect = $<HTMLSelectElement>(
    '.container-form__content--tags select',
  );
  const soldoutSelect = $<HTMLSelectElement>(
    '.container-form__content--soldout select',
  );
  const thumbnailInput = $<HTMLInputElement>(
    '.container-form__content--thumbnail input',
  );
  const preview = $<HTMLImageElement>(
    '.container-form__content--thumbnail img',
  );

  let profileImgBase64: string = ``;

  thumbnailInput.addEventListener('change', () => {
    const file = thumbnailInput.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.addEventListener('load', () => {
      profileImgBase64 = reader.result as string;
      preview.src = reader.result as string;
    });
  });

  document
    .querySelector('.container-form__btn--edit')
    .addEventListener('click', async () => {
      const product = {
        id: productId,
        title: titleInput.value,
        price: parseInt(priceInput.value),
        description: desciptionInput.value,
        tags: [tagsSelect.value],
        isSoldOut: 'true' === soldoutSelect.value,
        thumbnailBase64: profileImgBase64,
      };

      if (confirm('상품을 수정하시겠습니까?')) {
        await editProduct(product);
        alert('상품이 수정되었습니다.');
        router.navigate(`/admin/product/${productId}`);
      }
    });
};
