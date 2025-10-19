import dayjs from "dayjs";
import i18n from "@/i18n";

const { t } = i18n.global;

async function aliyunOssUpload(options?: { sourceType?: string[]; success?: (url: string) => void }) {
  const { success, sourceType = ["album"] } = options ?? {};

  try {
    const res = await uni.chooseImage({
      count: 1,
      sizeType: ["original"],
      sourceType,
      camera: "back",
    });

    const file = (res.tempFiles as any)[0];

    const fileSize = file.size / 1024 / 1024;

    if (fileSize > 5) {
      uni.showToast({
        title: t("message.Tip.Image_Size_Exceeded"),
        icon: "none",
      });
      return;
    }

    // TODO: 获取oss临时凭证
    const resOss: any = {};

    const { host, policy, signature, accessid } = resOss.data;

    const userData = uni.getStorageSync("userData");

    const path = `logistics/${userData.businessesCode}/${dayjs().year()}${dayjs().month() + 1}${dayjs().date()}${dayjs().valueOf()}/${file.name}`;
    // //@ts-ignore
    // await http.upload({
    // 	url: host,
    // 	filePath: file.path,
    // 	name: 'file',
    // 	formData: {
    // 		key: path,
    // 		policy,
    // 		OSSAccessKeyId: accessid,
    // 		signature,
    // 		success_action_status: '200',
    // 	},
    // 	success: (res) => {
    // 		if (res.statusCode === 200) {
    // 			success?.(`${host}/${path}`);
    // 		}
    // 	},
    // 	fail(result) {
    // 		console.log(result);

    // 		if (result.errMsg.includes('cancel')) return;

    // 		uni.showToast({
    // 			title: 'Error',
    // 			icon: 'none',
    // 		});
    // 	},
    // });
  }
  catch (error) {
    console.log(error);
    uni.showToast({
      title: "Error",
      icon: "none",
    });
  }
}
export default aliyunOssUpload;
