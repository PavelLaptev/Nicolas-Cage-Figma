declare module "*.scss" {
  const content: { [className: string]: string };
  export = content;
}

declare module "*.jpg" {
  const value: any;
  export default value;
}
