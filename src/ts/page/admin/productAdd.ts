import { router } from '../../main';
import { addProduct } from '../../api';
import { $ } from '../../utils/dom';

/** 상품 추가 핸들러 */
export const handleProductAddPage = () => {
  const form = $<HTMLFormElement>('.container-form');
  const titleInput = $<HTMLInputElement>(
    '.container-form__content--title input',
  );
  const priceInput = $<HTMLInputElement>(
    '.container-form__content--price input',
  );
  const desciptionInput = $<HTMLTextAreaElement>(
    '.container-form__content--description textarea',
  ) as HTMLTextAreaElement;
  const tagsSelect = $<HTMLSelectElement>(
    '.container-form__content--tags select',
  );
  const thumbnailInput = $<HTMLInputElement>(
    '.container-form__content--thumbnail input',
  );
  const preview = $<HTMLImageElement>(
    '.container-form__content--thumbnail img',
  );

  let profileImgBase64: string = '';

  thumbnailInput.addEventListener('change', () => {
    const file = thumbnailInput.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.addEventListener('load', () => {
      profileImgBase64 = reader.result as string;
      preview.src = reader.result as string;
    });
  });

  form.addEventListener('submit', async (e: SubmitEvent) => {
    e.preventDefault();

    const product = {
      title: titleInput.value,
      price: Number(priceInput.value),
      description: desciptionInput.value,
      tags: [tagsSelect.value],
      thumbnailBase64: profileImgBase64,
    };

    if (confirm('상품을 추가하시겠습니까?')) {
      await addProduct(product);
      alert('상품이 추가되었습니다.');
      router.navigate('/admin/product');
    }
  });
};
