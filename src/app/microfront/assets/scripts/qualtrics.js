(function () {
    class CookieManager {
        constructor(e, h, f, g) {
            this.e = e;
            this.h = h;
            this.f = f;
            this.g = g;
        }

        get(key) {
            const aKey = `${key}=`;
            const cookies = document.cookie.split(";").map(c => c.trim());

            for (const cookie of cookies) {
                if (cookie.startsWith(aKey)) {
                    return cookie.substring(aKey.length);
                }
            }
            return null;
        }

        set(key, value) {
            const expiryDate = new Date();
            expiryDate.setTime(expiryDate.getTime() + 604800000); // 7 días en milisegundos
            document.cookie = `${key}=${value}; expires=${expiryDate.toUTCString()}; path=/;`;
        }

        check() {
            let data = this.get(this.f);

            if (data) {
                data = data.split(":");
            } else if (this.e !== 100) {
                if (this.h === "v") {
                    this.e = Math.random() >= this.e / 100 ? 0 : 100;
                }
                data = [this.h, this.e, 0];
                this.set(this.f, data.join(":"));
            } else {
                return true;
            }

            const [, c, count] = data;
            if (c === "100") return true;

            if (data[0] === "v") return false;

            if (data[0] === "r") {
                const modValue = count % Math.floor(100 / c);
                data[2]++;
                this.set(this.f, data.join(":"));
                return !modValue;
            }

            return true;
        }

        go() {
            if (this.check()) {
                const script = document.createElement("script");
                script.type = "text/javascript";
                script.src = this.g;

                if (document.body) {
                    document.body.appendChild(script);
                }
            }
        }

        start() {
            if (document.readyState !== "complete") {
                window.addEventListener("load", () => this.go());
            } else {
                this.go();
            }
        }
    }
    try {
        const qualtricsContainerId = localStorage.getItem("qualtricsContainerId");
        const qualtricsUrl = localStorage.getItem("qualtricsUrl");
        new CookieManager(100, "r", qualtricsContainerId, qualtricsUrl).start();
    } catch (error) {
        console.error("Error en la inicialización:", error);
    }
})();
