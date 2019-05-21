## Intro
本脚本把二元回归的模型（VV,VH -> NDVI / VV,VH -> EVI）应用到 Sentinel-1 影像中，得到 Sentinel-1 反演的 EVI, NDVI 影像，并导出。

## 数据导入
在脚本开始前先导入必要的数据集。

- `S1` Sentinel 1 影像集（Earth Engine 自带）
- `vector` 鄱阳湖水域矢量边界（SHP 矢量文件上传）
- `imageVisParam` Sentinel 1 影像显示符号系统
- `geometry` 点要素，用于筛选 Sentinel 1 影像集（Earth Engine 上选择）
- `landsatImageVisParam` Landsat 影像的显示符号系统（选样本参考用）

## 脚本主程序
见 `Regression.js`.
