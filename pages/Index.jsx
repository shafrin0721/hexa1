import { jsx, jsxs } from "react/jsx-runtime";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
function Index() {
  return /* @__PURE__ */ jsx(Layout, { children: /* @__PURE__ */ jsxs("div", { className: "container py-24 flex flex-col items-center text-center", children: [
    /* @__PURE__ */ jsxs("h1", { className: "text-5xl font-bold tracking-tight text-foreground mb-4", children: [
      "Welcome to ",
      /* @__PURE__ */ jsx("span", { className: "text-primary", children: "Hexal" })
    ] }),
    /* @__PURE__ */ jsx("p", { className: "text-lg text-muted-foreground max-w-lg mb-8", children: "Your one-stop shop for premium products. Browse our collection and find exactly what you need." }),
    /* @__PURE__ */ jsxs("div", { className: "flex gap-4", children: [
      /* @__PURE__ */ jsx(Link, { to: "/products", children: /* @__PURE__ */ jsxs(Button, { size: "lg", className: "gap-2", children: [
        "Browse Products",
        /* @__PURE__ */ jsx(ArrowRight, { className: "h-4 w-4" })
      ] }) }),
      /* @__PURE__ */ jsx(Link, { to: "/contact", children: /* @__PURE__ */ jsx(Button, { variant: "outline", size: "lg", children: "Contact Us" }) })
    ] })
  ] }) });
}
export {
  Index as default
};
