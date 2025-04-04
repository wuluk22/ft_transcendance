export async function loadTemplate(templatePath: string): Promise<HTMLTemplateElement> {
    const response = await fetch(templatePath);
    if (!response.ok) {
        throw new Error(`Failed to load template: ${response.statusText}`);
    }
    const html = await response.text();
    // console.log("HTML : ", html);
    const wrapper = document.createElement("div");
    wrapper.innerHTML = html.trim();

    const template = wrapper.querySelector("template");
    if (!template) {
        throw new Error("No template found in the loaded HTML.");
    }
    document.body.appendChild(template);
    return template as HTMLTemplateElement;
}