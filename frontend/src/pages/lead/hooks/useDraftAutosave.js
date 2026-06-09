import { useEffect } from "react";
import { saveDraft } from "../../../services/draftsService";
import { DRAFT_AUTOSAVE_DELAY } from "../utils/leadFormConstants";

export function useDraftAutosave(form, draftLoaded, isEditRoute, setDraftId) {
    useEffect(() => {
        if (!draftLoaded) return;

        const hasData =
            form.full_name ||
            form.phone ||
            form.email ||
            form.company ||
            form.position ||
            form.event_id != null ||
            form.product_ids.length > 0;

        if (!hasData) return;

        const timeout = setTimeout(async () => {
            try {
                const saved = await saveDraft(form);
                if (saved && setDraftId) {
                    setDraftId(form.id);
                }
            } catch (error) {
                console.error("Draft save error:", error);
            }
        }, DRAFT_AUTOSAVE_DELAY);

        return () => clearTimeout(timeout);
    }, [form, draftLoaded, isEditRoute]);
}