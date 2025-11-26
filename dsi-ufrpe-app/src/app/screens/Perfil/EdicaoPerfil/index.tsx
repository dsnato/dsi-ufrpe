import { supabase } from "@/lib/supabase";
import { ActionButton } from "@/src/components/ActionButton";
import { FormInput } from "@/src/components/FormInput";
import { ImagePicker } from "@/src/components/ImagePicker";
import { InfoHeader } from "@/src/components/InfoHeader";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const palettes = {
    light: {
        background: "#132F3B",
        content: "#F8FAFC",
        card: "#FFFFFF",
        text: "#0F172A",
        muted: "#64748B",
    },
    dark: {
        background: "#050C18",
        content: "#0B1624",
        card: "#16243A",
        text: "#E2E8F0",
        muted: "#94A3B8",
    },
} as const;

export default function EdicaoPerfil() {
    const router = useRouter();
    const { theme: themeParam, hotelName: hotelParam } = useLocalSearchParams<{ theme?: string; hotelName?: string }>();
    const themeKey = themeParam === "dark" ? "dark" : "light";
    const theme = useMemo(() => palettes[themeKey], [themeKey]);

    const formatPhoneInput = (text: string) => {
        const digits = text.replace(/\D/g, "").slice(0, 11);
        if (!digits) return "";
        if (digits.length <= 2) return `(${digits}`;
        if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
        return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
    };

    const formatCnpjInput = (text: string) => {
        const digits = text.replace(/\D/g, "").slice(0, 14);
        if (!digits) return "";
        let formatted = digits;
        if (digits.length >= 3) {
            formatted = `${digits.slice(0, 2)}.${digits.slice(2)}`;
        }
        if (digits.length >= 6) {
            formatted = `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5)}`;
        }
        if (digits.length >= 9) {
            formatted = `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8)}`;
        }
        if (digits.length >= 13) {
            formatted = `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8, 12)}-${digits.slice(12)}`;
        }
        return formatted;
    };

    const sanitizeDigits = (value: string) => value.replace(/\D/g, "");

    const [name, setName] = useState("Gerente do Hotel");
    const [phone, setPhone] = useState("(81) 99999-9999");
    const [cnpj, setCnpj] = useState("12.345.678/0001-90");
    const [hotelName, setHotelName] = useState(
        typeof hotelParam === "string" && hotelParam.length > 0 ? hotelParam : "Hotel Atlântico"
    );
    const [avatarUri, setAvatarUri] = useState<string | undefined>();
    const [userId, setUserId] = useState<string | null>(null);
    const [loadingProfile, setLoadingProfile] = useState(true);
    const [saving, setSaving] = useState(false);

    const handlePhoneChange = (text: string) => {
        const formatted = formatPhoneInput(text);
        setPhone(formatted || "");
    };

    const handleCnpjChange = (text: string) => {
        setCnpj(formatCnpjInput(text));
    };

    useEffect(() => {
        let isActive = true;

        const loadProfile = async () => {
            try {
                setLoadingProfile(true);
                const { data, error } = await supabase.auth.getUser();

                if (error) {
                    throw error;
                }

                const user = data?.user;
                if (!user) {
                    router.replace("/screens/Login");
                    return;
                }

                if (!isActive) return;

                setUserId(user.id);
                const metadata = user.user_metadata || {};
                const fallbackName = metadata.display_name || metadata.nome_completo || metadata.nome || user.email?.split("@")[0] || "Gerente do Hotel";
                setName(fallbackName);

                const normalizedPhone = metadata.phone || metadata.telefone || "";
                setPhone(normalizedPhone ? formatPhoneInput(normalizedPhone) : "");

                const normalizedCnpj = metadata.cnpj || "";
                setCnpj(normalizedCnpj ? formatCnpjInput(normalizedCnpj) : "");

                setHotelName(metadata.hotel_name || metadata.nome_hotel || "Hotel Atlântico");
                setAvatarUri(metadata.avatar_url || undefined);
            } catch (error) {
                console.error("Erro ao carregar dados do usuário:", error);
                if (isActive) {
                    Alert.alert("Não foi possível carregar", "Tente novamente em instantes.");
                }
            } finally {
                if (isActive) {
                    setLoadingProfile(false);
                }
            }
        };

        loadProfile();

        return () => {
            isActive = false;
        };
    }, [router]);

    const handleSave = async () => {
        if (saving) {
            return;
        }

        setSaving(true);

        try {
            const normalizedName = name.trim();
            const normalizedHotel = hotelName.trim();
            const normalizedPhone = sanitizeDigits(phone);
            const normalizedCnpj = sanitizeDigits(cnpj);

            const { error } = await supabase.auth.updateUser({
                data: {
                    display_name: normalizedName,
                    hotel_name: normalizedHotel,
                    phone: normalizedPhone,
                    cnpj: normalizedCnpj,
                    avatar_url: avatarUri ?? null,
                },
            });

            if (error) {
                throw error;
            }

            if (userId) {
                try {
                    await supabase
                        .from("profiles")
                        .update({ username: normalizedName })
                        .eq("id", userId);
                } catch (profileError) {
                    console.warn("Não foi possível atualizar profiles:", profileError);
                }
            }

            Alert.alert("Perfil atualizado", "Suas informações foram salvas.", [
                {
                    text: "OK",
                    onPress: () => router.back(),
                },
            ]);
        } catch (error) {
            console.error("Erro ao salvar perfil:", error);
            Alert.alert("Não foi possível salvar", "Verifique seus dados e tente novamente.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
            <InfoHeader
                entity="Perfil"
                action="Edição"
                onBackPress={() => router.push("/screens/Perfil")}
                colors={{ background: theme.background }}
            />
            <View style={[styles.content, { backgroundColor: theme.content }]}>
                {loadingProfile ? (
                    <View style={styles.loadingState}>
                        <ActivityIndicator size="large" color={theme.text} />
                        <Text style={[styles.loadingText, { color: theme.muted }]}>Carregando perfil...</Text>
                    </View>
                ) : (
                    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                        <View style={[styles.card, styles.avatarCard, { backgroundColor: theme.card }]}>
                            <Text style={[styles.cardTitle, { color: theme.text }]}>Foto do gerente</Text>
                            <Text style={[styles.cardSubtitle, { color: theme.muted }]}>Adicione ou atualize a imagem que aparece no painel.</Text>
                            <ImagePicker
                                imageUri={avatarUri}
                                onImageSelected={setAvatarUri}
                                onImageRemoved={() => setAvatarUri(undefined)}
                                tone={themeKey}
                                disabled={saving}
                            />
                            <Text style={[styles.avatarHelper, { color: theme.muted }]}>Recomendado quadrado, mínimo de 512px.</Text>
                        </View>

                        <Text style={[styles.sectionTitle, { color: theme.text }]}>Dados principais</Text>
                        <Text style={[styles.sectionSubtitle, { color: theme.muted }]}>Atualize seu nome e informações de contato.</Text>

                        <View style={[styles.card, { backgroundColor: theme.card }]}>
                            <View style={styles.formGroup}>
                                <Text style={[styles.label, { color: theme.text }]}>Nome completo</Text>
                                <FormInput
                                    icon="person-outline"
                                    placeholder="Seu nome"
                                    value={name}
                                    onChangeText={setName}
                                    maxLength={80}
                                    editable={!saving}
                                />
                            </View>

                            <View style={styles.formGroup}>
                                <Text style={[styles.label, { color: theme.text }]}>Celular</Text>
                                <FormInput
                                    icon="call-outline"
                                    placeholder="(00) 00000-0000"
                                    value={phone}
                                    onChangeText={handlePhoneChange}
                                    keyboardType="phone-pad"
                                    maxLength={15}
                                    editable={!saving}
                                />
                            </View>

                            <View style={styles.formGroup}>
                                <Text style={[styles.label, { color: theme.text }]}>CNPJ</Text>
                                <FormInput
                                    icon="document-text-outline"
                                    placeholder="00.000.000/0000-00"
                                    value={cnpj}
                                    onChangeText={handleCnpjChange}
                                    keyboardType="number-pad"
                                    maxLength={18}
                                    editable={!saving}
                                />
                            </View>

                            <View style={styles.formGroup}>
                                <Text style={[styles.label, { color: theme.text }]}>Nome do hotel</Text>
                                <FormInput
                                    icon="business-outline"
                                    placeholder="Como o hotel deve aparecer"
                                    value={hotelName}
                                    onChangeText={setHotelName}
                                    maxLength={100}
                                    editable={!saving}
                                />
                            </View>
                        </View>

                        <View style={styles.actions}>
                            <ActionButton
                                variant="primary"
                                icon="checkmark-circle-outline"
                                tone={themeKey}
                                onPress={handleSave}
                                disabled={saving}
                            >
                                {saving ? "Salvando..." : "Salvar alterações"}
                            </ActionButton>
                            <ActionButton
                                variant="secondary"
                                icon="close-circle-outline"
                                tone={themeKey}
                                onPress={() => router.back()}
                                disabled={saving}
                            >
                                Cancelar
                            </ActionButton>
                        </View>
                    </ScrollView>
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    content: {
        flex: 1,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        overflow: "hidden",
    },
    scrollContent: {
        padding: 20,
        gap: 20,
        paddingBottom: 40,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: "700",
    },
    sectionSubtitle: {
        fontSize: 14,
        marginTop: -6,
        marginBottom: 8,
    },
    card: {
        borderRadius: 16,
        padding: 20,
        gap: 18,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 3,
    },
    avatarCard: {
        gap: 12,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: "700",
    },
    cardSubtitle: {
        fontSize: 14,
        lineHeight: 20,
    },
    loadingState: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
    },
    loadingText: {
        fontSize: 14,
    },
    avatarHelper: {
        fontSize: 12,
        marginTop: -4,
    },
    formGroup: {
        gap: 8,
    },
    label: {
        fontSize: 14,
        fontWeight: "600",
        color: "#334155",
    },
    actions: {
        gap: 12,
    },
});

