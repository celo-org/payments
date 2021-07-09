"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchWithRetries = void 0;
const isomorphic_fetch_1 = __importDefault(require("isomorphic-fetch"));
async function fetchWithRetries(info, init) {
    let lastResponse = null;
    for (let i = 0; i < 3; i++) {
        const response = await isomorphic_fetch_1.default(info, init);
        if (response.status >= 500) {
            lastResponse = response;
        }
        else {
            return response;
        }
    }
    return lastResponse;
}
exports.fetchWithRetries = fetchWithRetries;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmV0Y2gtd2l0aC1yZXRyaWVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZmV0Y2gtd2l0aC1yZXRyaWVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLHdFQUFxQztBQUU5QixLQUFLLFVBQVUsZ0JBQWdCLENBQUMsSUFBaUIsRUFBRSxJQUFrQjtJQUMxRSxJQUFJLFlBQVksR0FBRyxJQUFJLENBQUM7SUFDeEIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUMxQixNQUFNLFFBQVEsR0FBRyxNQUFNLDBCQUFLLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3pDLElBQUksUUFBUSxDQUFDLE1BQU0sSUFBSSxHQUFHLEVBQUU7WUFDMUIsWUFBWSxHQUFHLFFBQVEsQ0FBQztTQUN6QjthQUFNO1lBQ0wsT0FBTyxRQUFRLENBQUM7U0FDakI7S0FDRjtJQUVELE9BQU8sWUFBWSxDQUFDO0FBQ3RCLENBQUM7QUFaRCw0Q0FZQyJ9