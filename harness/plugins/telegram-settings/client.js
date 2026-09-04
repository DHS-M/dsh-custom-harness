window.__ModuleLoader__.load({
	id: "@custom/telegram-settings",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		const react = require("react");
		const jsx = require("react/jsx-runtime");
		const { useState, useEffect } = react;

		function TelegramSection() {
			const [token, setToken] = useState("");
			const [enabled, setEnabled] = useState(false);
			const [dshUrl, setDshUrl] = useState("");
			const [msg, setMsg] = useState("");

			useEffect(() => {
				try {
					const raw = localStorage.getItem("dsh.telegram.settings");
					if (raw) {
						const o = JSON.parse(raw);
						setToken(o.token || "");
						setEnabled(!!o.enabled);
						setDshUrl(o.dshUrl || "");
					}
				} catch {}
			}, []);

			function save() {
				const body = { token, enabled, dshUrl };
				try {
					localStorage.setItem("dsh.telegram.settings", JSON.stringify(body));
				} catch {}
				setMsg("Saved in browser. For the bot process, set TELEGRAM_BOT_TOKEN or write /data/dsh/telegram.json on the volume.");
			}

			return jsx.jsxs("div", {
				style: { display: "flex", flexDirection: "column", gap: 12, padding: 16, maxWidth: 480 },
				children: [
					jsx.jsx("h3", { style: { margin: 0 }, children: "Telegram bot" }),
					jsx.jsx("p", {
						style: { margin: 0, opacity: 0.75, fontSize: 13, lineHeight: 1.45 },
						children:
							"BotFather token for DMs, groups (@mention), topics, and channels.",
					}),
					jsx.jsx("label", { style: { fontSize: 12, opacity: 0.7 }, children: "Bot token" }),
					jsx.jsx("input", {
						type: "password",
						value: token,
						onChange: (e) => setToken(e.target.value),
						placeholder: "123456:ABC…",
						style: {
							padding: "10px 12px",
							borderRadius: 8,
							border: "1px solid var(--dsw-alias-border-l2, #333)",
							background: "var(--dsw-alias-bg-primary, #111)",
							color: "inherit",
						},
					}),
					jsx.jsx("label", { style: { fontSize: 12, opacity: 0.7 }, children: "Public DSH URL" }),
					jsx.jsx("input", {
						type: "url",
						value: dshUrl,
						onChange: (e) => setDshUrl(e.target.value),
						placeholder: "https://…",
						style: {
							padding: "10px 12px",
							borderRadius: 8,
							border: "1px solid var(--dsw-alias-border-l2, #333)",
							background: "var(--dsw-alias-bg-primary, #111)",
							color: "inherit",
						},
					}),
					jsx.jsxs("label", {
						style: { display: "flex", gap: 8, alignItems: "center", fontSize: 13 },
						children: [
							jsx.jsx("input", {
								type: "checkbox",
								checked: enabled,
								onChange: (e) => setEnabled(e.target.checked),
							}),
							"Enable bot sidecar",
						],
					}),
					jsx.jsx("button", {
						type: "button",
						onClick: save,
						style: {
							alignSelf: "flex-start",
							padding: "10px 16px",
							borderRadius: 8,
							border: "none",
							background: "#3b82f6",
							color: "#fff",
							fontWeight: 600,
							cursor: "pointer",
						},
						children: "Save",
					}),
					msg && jsx.jsx("p", { style: { margin: 0, fontSize: 13, color: "#4ade80" }, children: msg }),
				],
			});
		}

		const inject = ["slots"];

		function apply(ctx) {
			ctx.slots.inject("settings.section", () =>
				ctx.slots.register(
					{
						name: "settings.section",
						id: "telegram",
						order: 40,
						label: () => "Telegram",
					},
					TelegramSection
				)
			);
		}

		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	},
});
