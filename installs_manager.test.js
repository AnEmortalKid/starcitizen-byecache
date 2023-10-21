const fs = require("fs");
const Store = require("electron-store");
jest.mock("electron-store");
const os = require("os");
const path = require("path");

const installManager = require("./installs_manager");

describe("installsManager", () => {
  describe("addInstallLocation", () => {
    it("does not allow a dir without a USER folder", () => {
      const tmpPath = fs.mkdtempSync(
        path.join(os.tmpdir(), "byecache-installs-add"),
      );
      const res = installManager.addInstallLocation(tmpPath);

      expect(res).toEqual({
        success: false,
        error: "Directory selected does not contain a USER folder.",
      });
    });

    it("saves the parent to the USER folder", () => {
      let settingsState = [];

      jest.spyOn(Store.prototype, "get").mockImplementation(() => {
        return settingsState;
      });

      const tmpPath = fs.mkdtempSync(
        path.join(os.tmpdir(), "byecache-installs-add"),
      );
      fs.mkdirSync(path.join(tmpPath, "USER"));
      const res = installManager.addInstallLocation(tmpPath);

      expect(res.success).toBeTruthy();
      expect(res.data.location).toEqual(tmpPath);

      // should save to the store
      let setSpy = jest.spyOn(Store.prototype, "set");
      expect(setSpy).toHaveBeenCalledTimes(1);
    });

    it("does not duplicate locations", () => {
      const tmpPath = fs.mkdtempSync(
        path.join(os.tmpdir(), "byecache-installs-add"),
      );
      fs.mkdirSync(path.join(tmpPath, "USER"));

      let settingsState = [
        {
          location: tmpPath,
        },
      ];

      jest.spyOn(Store.prototype, "get").mockImplementation(() => {
        return settingsState;
      });

      const res = installManager.addInstallLocation(tmpPath);

      expect(res).toEqual({ success: true });

      // should save to the store
      let setSpy = jest.spyOn(Store.prototype, "set");
      expect(setSpy).not.toHaveBeenCalledTimes(1);
    });
  });
});
