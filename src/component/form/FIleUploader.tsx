import { useState, useCallback } from "react";
import * as qiniu from "qiniu-js";
import SparkMD5 from "spark-md5";

export interface UploadTask {
  id: string;
  file: File;
  progress: number;
  status: "pending" | "uploading" | "success" | "error";
  key?: string;
  error?: string;
}

interface FileUploaderProps {
  folder?: string;
  maxFiles?: number;
  allowedTypes?: string[];
  getUploadToken: (params: {
    md5: string;
    fileName: string;
    fileType: string;
    folder: string;
  }) => Promise<{ token: string; key: string; fileID: string }>;
}

export const useFileUploader = (props: FileUploaderProps) => {
  const { folder="", maxFiles = 4, allowedTypes = ["image/*", "video/*"], getUploadToken } =
    props;

  const [uploadTasks, setUploadTasks] = useState<UploadTask[]>([]);

  // 计算文件 MD5
  const calculateMD5 = useCallback((file: File): Promise<string> => {
    return new Promise((resolve) => {
      const chunkSize = 2 * 1024 * 1024; // 2MB chunks
      const spark = new SparkMD5.ArrayBuffer();
      const fileReader = new FileReader();
      let currentChunk = 0;

      const loadNext = () => {
        const start = currentChunk * chunkSize;
        const end = Math.min(start + chunkSize, file.size);
        fileReader.readAsArrayBuffer(file.slice(start, end));
      };

      fileReader.onload = (e) => {
        spark.append(e.target?.result as ArrayBuffer);
        currentChunk++;
        currentChunk * chunkSize < file.size ? loadNext() : resolve(spark.end());
      };

      loadNext();
    });
  }, []);

  // 处理文件上传
  const uploadFile = useCallback(
    async (file: File): Promise<string> => {
      const md5 = await calculateMD5(file);
      const { token, key } = await getUploadToken({
        md5,
        fileName: file.name,
        fileType: file.type,
        folder: folder,
      });

      return new Promise((resolve, reject) => {
        const observable = qiniu.upload(
          file,
          key,
          token,
          { fname: file.name },
          { region: qiniu.region.z2, useCdnDomain: true }
        );

        observable.subscribe({
          next: (res) => {
            setUploadTasks((prev) =>
              prev.map((task) =>
                task.file === file
                  ? { ...task, progress: res.total.percent }
                  : task
              )
            );
          },
          error: (err) => {
            setUploadTasks((prev) =>
              prev.map((task) =>
                task.file === file
                  ? { ...task, status: "error", error: err.message }
                  : task
              )
            );
            reject(err);
          },
          complete: (res) => {
            setUploadTasks((prev) =>
              prev.map((task) =>
                task.file === file
                  ? { ...task, status: "success", key: res.key }
                  : task
              )
            );
            resolve(res.key);
          },
        });
      });
    },
    [calculateMD5, getUploadToken]
  );

  // 处理文件选择
  const handleFileChange = useCallback(
    (files: FileList | null) => {
      if (!files) return;

      const validFiles = Array.from(files).filter((file) => {
        const typeCategory = file.type.split("/")[0];
        return (
          allowedTypes.some((allowed) => {
            const [type, subtype] = allowed.split("/");
            return subtype === "*"
              ? type === typeCategory
              : allowed === file.type;
          }) && uploadTasks.length < maxFiles
        );
      });

      const newTasks: UploadTask[] = validFiles.map((file) => ({
        id: Math.random().toString(36).substr(2, 9),
        file,
        progress: 0,
        status: "pending",
      }));

      setUploadTasks((prev) => [...prev, ...newTasks]);

      // 开始上传
      newTasks.forEach(async (task) => {
        setUploadTasks((prev) =>
          prev.map((t) =>
            t.id === task.id ? { ...t, status: "uploading" } : t
          )
        );
        await uploadFile(task.file);
      });
    },
    [allowedTypes, maxFiles, uploadTasks, uploadFile]
  );

  // 删除任务
  const removeUploadTask = useCallback((id: string) => {
    setUploadTasks((prev) => prev.filter((task) => task.id !== id));
  }, []);

  return { uploadTasks, handleFileChange, removeUploadTask };
};