import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { mapLeadToForm } from "../utils/leadFormUtils.js";
import axios from "axios";
import { isServerAvailable } from "../../../services/networkService";
import { getPendingLeadById } from "../../../services/pendingLeadsService";
import { INITIAL_FORM } from "../utils/leadFormConstants";

export function useLeadData(id, isEditRoute) {
    const navigate = useNavigate();
    const [form, setForm] = useState({ ...INITIAL_FORM, id: crypto.randomUUID() });
    const [originalForm, setOriginalForm] = useState({ ...INITIAL_FORM });
    const [leadSource, setLeadSource] = useState("server");
    const [loading, setLoading] = useState(isEditRoute);

    useEffect(() => {
        if (!isEditRoute) return;

        const load = async () => {
            try {
                const online = await isServerAvailable();

                if (!online) {
                    await loadFromLocal();
                    return;
                }

                await loadFromServer();

            } finally {
                setLoading(false);
            }
        };

        load();
    }, [id, isEditRoute]);

    async function loadFromServer() {
        try {
            const token = localStorage.getItem("access_token");
            const { data } = await axios.get(`/api/leads/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
            });

            const lead = data.lead ?? data;
            const filled = mapLeadToForm(lead);

            setLeadSource("server");
            setForm(filled);
            setOriginalForm(filled);

        } catch (error) {
            console.error("loadFromServer error:", error);
            const status = error.response?.status;

            if (status === 401) {
                navigate("/login");
                return;
            }

            if (status === 404) {
                await loadFromLocal();
                return;
            }

            alert("Ошибка загрузки заявки");
            navigate(-1);
        }
    }

    async function loadFromLocal() {
        const localLead = await getPendingLeadById(Number(id));

        if (!localLead) {
            alert("Заявка не найдена локально");
            navigate(-1);
            return;
        }

        const filled = mapLeadToForm(localLead);
        setLeadSource("local");
        setForm(filled);
        setOriginalForm(filled);
    }

    return { form, setForm, originalForm, setOriginalForm, leadSource, loading };
}