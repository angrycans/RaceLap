import RNFS from 'react-native-fs';
import moment from 'moment';
import { GPSPOSTION, defaultRLDATAPath } from "./index"
import { Platform, PermissionsAndroid } from 'react-native';

// 文件路径

const destPath = defaultRLDATAPath + '/racelap';
const splitStr = '\n';

class FileUtil {



    async writeGps(data: GPSPOSTION, filename: string) {
        const isDir = await this.mkDir();
        // console.log(isDir, 'dir')
        if (!isDir) {
            return false;
        }

        const jsonStr = `${moment(new Date().getTime()).format("HH:mm:ss.SSS")},${moment(data.timestamp).format("HH:mm:ss.SSS")},${data.coords.latitude},${data.coords.longitude},${data.coords.speed},${data.coords.accuracy},${data.coords.altitude},${data.coords.altitudeAccuracy},${data.coords.heading}`


        //moment(new Date().getTime()).format("HH:mm:ss.SSS")+','+moment(data.timestamp).format("HH:mm:ss.SSS")+','
        // data.createTime = +new Date();
        //const jsonStr = JSON.stringify(Object.assign({}, data, { createTime: +new Date() }));
        // const today = moment().startOf('day').valueOf();
        let filePath = defaultPath + '/';
        if (filename) {
            filePath += filename;
        } else {
            // const today = moment().valueOf();
            filePath += moment(new Date()).format("YYYYMMDD") + '.txt';

        }

        console.log("filename", filePath)

        // 判断文件是否存在
        const isExists = await this.isExistFile(filePath);
        if (!isExists) {
            return await RNFS.writeFile(filePath, jsonStr, 'utf8')
                .then((success) => {
                    console.log('FILE WRITTEN!');
                    return success;
                })
                .catch((err) => {
                    console.log(err.message);
                })
        } else {
            return await this.appendGps(jsonStr, filePath);
        }

    }


    async writeFile(data, filename) {
        const isDir = await this.mkDir();
        // console.log(isDir, 'dir')
        if (!isDir) {
            return false;
        }

        // data.createTime = +new Date();
        const jsonStr = JSON.stringify(Object.assign({}, data, { createTime: +new Date() }));
        // const today = moment().startOf('day').valueOf();
        let filePath = defaultPath + '/';
        if (filename) {
            filePath += filename;
        } else {
            // const today = moment().valueOf();
            filePath += moment(new Date()).format("YYYYMMDD") + '.txt';

        }

        console.log("filename", filePath)

        // 判断文件是否存在
        const isExists = await this.isExistFile(filePath);
        if (!isExists) {
            return await RNFS.writeFile(filePath, jsonStr, 'utf8')
                .then((success) => {
                    console.log('FILE WRITTEN!');
                    return success;
                })
                .catch((err) => {
                    console.log(err.message);
                })
        } else {
            return await this.appendFile(jsonStr, filePath);
        }
    }

    async appendGps(data, path) {
        //  const jsonStr = JSON.stringify(data);
        return await RNFS.appendFile(path, splitStr + data, 'utf8')
            .then((success) => {
                console.log('FILE APPEND SUCCESS');
                return success;
            })
            .catch((err) => {
                console.log(err.message);
            });
    }

    // 向文件中添加内容
    async appendFile(data, path) {
        const jsonStr = JSON.stringify(data);
        return await RNFS.appendFile(path, splitStr + jsonStr, 'utf8')
            .then((success) => {
                console.log('FILE APPEND SUCCESS');
                return success;
            })
            .catch((err) => {
                console.log(err.message);
            });
    }

    // 判断文件是否存在
    isExistFile = async (filePath, cb) => {
        return await RNFS.exists(filePath)
            .then(res => {
                console.log('isExists, ' + res)
                cb && cb(res);
                return res;
            });
    };

    // 读取文件
    async readFile(filePath, name, successCallback, failCallback) {
        const isExists = await this.isExistFile(filePath);
        if (!isExists) return;

        return await RNFS.readFile(filePath, 'utf8')
            .then((result) => {
                // Alert.alert(result)
                // console.log('=================file read start===================')
                const res = result.indexOf(splitStr) > -1 ? result.split(splitStr) : [result];

                // console.log(res)
                // console.log('=================file read end===================')
                // console.log(res.length, JSON.parse(res[0], 'ppppp'))
                for (let i = 0, len = res.length; i < len; i++) {
                    res[i] = JSON.parse(res[i]);
                }
                // console.log(res[2])

                successCallback && successCallback(result);
                return {
                    name,
                    content: res,
                };
            })
            .catch((err) => {
                failCallback && failCallback(err.message)
            });
    }

    async editFile(name, data) {
        // 先删除文件，再创建
        const filePath = defaultPath + '/' + name;
        console.log(filePath, 'filePath edit')
        const isExists = await this.isExistFile(filePath);
        console.log('edit file exists is,', isExists);

        await this.deleteFile(filePath);

        // 写入文件
        return await this.writeFile(data.join(''), name);
    }

    // 读取目录
    async readDir() {
        // On Android, use "RNFS.DocumentDirectoryPath" (MainBundlePath is not defined)
        const res = await RNFS.readDir(defaultPath)
            .then((result) => {

                const resP = [];
                if (result && result.length > 0) {
                    result = result.filter(item => item.isFile());
                    for (let i = 0, len = result.length; i < len; i++) {
                        // resP[i] = RNFS.readFile(result[i].path, 'utf8')
                        resP[i] = this.readFile(result[i].path, result[i].name);
                    }
                }
                return Promise.all(resP);
            })
            .then((statResult) => {
                return statResult;
            })
            .catch((err) => {
                console.log(err.message, err.code);
            });

        console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++')
        console.log(res, 'end of read')
        return res;
    }

    // 读取目录
    readDir1() {
        RNFS.readDir(defaultPath) // On Android, use "RNFS.DocumentDirectoryPath" (MainBundlePath is not defined)
            .then((result) => {
                console.log('GOT RESULT', result);
                console.log('++++++++++++++++++++++++++++++++++++++++')
                console.log(result.length)
                console.log('================================================')

                // stat the first file
                return Promise.all([RNFS.stat(result[0].path), result[0].path]);
            })
            .then((statResult) => {
                console.log(statResult)
                if (statResult[0].isFile()) {
                    // if we have a file, read it
                    return RNFS.readFile(statResult[1], 'utf8');
                }

                return 'no file';
            })
            .then((contents) => {
                // log the file contents
                console.log('=======================================================')
                console.log(contents, 'content');
            })
            .catch((err) => {
                console.log(err.message, err.code);
            });
    }
    // 删除文件
    async deleteFile(filePath) {
        const path = filePath || defaultPath;
        const res = await RNFS.unlink(path)
            .then(() => {
                console.log('FILE DELETED');
            })
            .catch((err) => {
                console.log(err.message);
            })
        return res;
    }
    getPath() {
        return 'file://'.concat(destPath);
    }
    // 判断文件路径是否存在
    isFilePathExists(successCallback) {
        RNFS.exists(destPath)
            .then((value) => {
                successCallback(value);
            })
            .catch((err) => {
                console.log(err.message);
            });
    }
    // 复制文件
    copyFile() {
        RNFS.copyFile(defaultPath, destPath)
            .then(() => {
                console.log('COPY FILE SUCCESSED');
            })
            .catch((err) => {
                console.log('copyFile Failed', err.message);
            });

    }
    // 移动文件
    moveFile() {
        RNFS.moveFile(defaultPath, destPath)
            .then(() => {
                console.log('moveFIle Success');
            })
            .catch((err) => {
                console.log('moveFile failed', err);
            });
    }
    /*创建目录*/
    async mkDir() {
        const options = {
            NSURLIsExcludedFromBackupKey: true, // iOS only
        };

        return await RNFS.mkdir(defaultPath, options)
            .then((res) => {
                console.log('MKDIR success', res);
                return true;
            }).catch((err) => {
                console.log('err', err);
            });
    }

    /*创建目录*/
    async mkdefaultRLDATAPathDir() {
        console.log("mkdefaultRLDATAPathDir start");

        const options = {
            NSURLIsExcludedFromBackupKey: true, // iOS only
        };

        const isExists = await RNFS.exists(defaultRLDATAPath)
        console.log("defaultRLDATAPath isExists " + isExists);
        if (!isExists) {
            await RNFS.mkdir(defaultRLDATAPath, options)
                .then((res) => {
                    console.log('MKDIR success',);
                    return true;
                }).catch((err) => {
                    console.log('err', err);
                });
        }

    }
}

const rnfile = new FileUtil();

setTimeout(() => {
    rnfile.mkdefaultRLDATAPathDir();

}, 500);

export default rnfile;