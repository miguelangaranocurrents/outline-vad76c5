import { test, expect } from "@playwright/test";
import { api, createDocument, sharedCollection, uniqueName } from "../support/api";

test.describe("History", () => {
  test("opens the current version of a document edited since its last revision", async ({ page, request }) => {
    const doc = await createDocument(request, {
      collectionId: sharedCollection().id,
      title: uniqueName("Release plan"),
      text: "Ship the beta in March.",
    });
    await api(request, "documents.update", {
      id: doc.id,
      text: "Ship the beta in March.\n\nInvite the first customers in April.",
    });

    await page.goto(`${doc.url}/history`);
    const current = page.getByRole("complementary").getByText("Current version");
    await expect(current).toBeVisible();
    await current.click();

    const editor = page.locator(".ProseMirror").first();
    await expect(editor.getByText("Invite the first customers in April.")).toBeVisible();
    await expect(editor.getByText("Ship the beta in March.")).toBeVisible();
  });
});
