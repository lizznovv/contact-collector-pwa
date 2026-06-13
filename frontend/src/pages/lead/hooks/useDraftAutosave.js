import { useEffect, useRef } from "react";
import { saveDraft } from "../../../services/draftsService";
import { DRAFT_AUTOSAVE_DELAY } from "../utils/leadFormConstants";

export function useDraftAutosave(form, draftLoaded, isEditing, setDraftId) {
    const skipRef = useRef(false);

    useEffect(() => {
        if (!draftLoaded) return;
        if (!isEditing) return;
        if (skipRef.current) return;

        const hasData =
            form.full_name ||
            form.phone ||
            form.email ||
            form.company ||
            form.position ||
            form.comments ||
            form.event_id != null ||
            form.product_ids.length > 0;

        if (!hasData) return;

        const timeout = setTimeout(async () => {
            if (skipRef.current) return;

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
    }, [form, draftLoaded, isEditing]);

    return { skipRef };
}