import http from "k6/http";
import { check } from "k6";

const BASE_URL = __ENV.BASE_URL || "http://localhost:3000";

const validUsers = [
  { email: "alice@example.com", password: "alice123" },
  { email: "bob@example.com", password: "bob123" },
  { email: "carol@example.com", password: "carol123" },
];

export const options = {
  stages: [
    { duration: "5s", target: 10 },
    { duration: "20s", target: 30 },
    { duration: "5s", target: 0 },
  ],
  thresholds: {
    http_req_duration: ["p(95)<500"],
  },
};

export default function () {
  const user = validUsers[__VU % validUsers.length];

  const payload = JSON.stringify({
    email: user.email,
    password: user.password,
  });

  const response = http.post(`${BASE_URL}/api/login`, payload, {
    headers: { "Content-Type": "application/json" },
  });

  check(response, {
    "login status is 200": (r) => r.status === 200,
    "token exists in response body": (r) => {
      const body = r.json();
      return body && typeof body.token === "string" && body.token.length > 0;
    },
  });
}
