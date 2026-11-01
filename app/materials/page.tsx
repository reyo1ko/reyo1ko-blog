import type { Metadata } from "next";
import PageHeading from "../components/PageHeading";
import MaterialGallery from "./MaterialGallery";
export const metadata: Metadata = {
  title: "画像素材",
  description:
    "統一した配色のピクセルアート素材。透過PNGをダウンロードし、再現用プロンプトを確認できます。",
};
export default function MaterialsPage() {
  return (
    <div>
      <PageHeading
        eyebrow="PIXEL MATERIAL LIBRARY"
        title="画像素材"
        description="記事や資料に、小さなドット絵を。同じサイズ・同じ配色の素材と、つくり方をまとめました。"
        icon="image"
      />
      <MaterialGallery />
    </div>
  );
}
