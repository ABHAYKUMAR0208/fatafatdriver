import React, { useState } from 'react';
import { Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import MdiIcon from '@/components/common/MdiIcon';
import ActionButton from '@/components/registration/ActionButton';
import BottomBar from '@/components/registration/BottomBar';
import DriverStepTitle from '@/components/driver/DriverStepTitle';
import DriverTitleBar from '@/components/driver/DriverTitleBar';
import SectionLabel from '@/components/driver/SectionLabel';
import { colors } from '@/constants/colors';
import { MDI } from '@/constants/iconPaths';
import { MDI_DOCS } from '@/constants/iconPathsDocs';
import { fonts } from '@/constants/typography';
import type { RootStackParamList } from '@/navigation/types';
import { DRIVER_DOCS } from '@/constants/driverDocuments';
import { useDriverDocuments } from '@/state/driverDocumentStore';
import { useDriverProfile } from '@/state/driverProfileStore';

type Props = NativeStackScreenProps<RootStackParamList, 'DriverReview'>;

const CARD_BORDER = '#D1D5DB';

// TODO: replace with the data the driver entered in the earlier steps
// const DATA = {
//   name: 'Rajesh Kumar',
//   phone: '+91 98765 43210',
//   city: 'Delhi',
//   languages: 'Hindi, English',
//   experience: '5-10 years',
//   license: 'LMV (Light Motor Vehicle)',
//   vehicles: 'Sedan, SUV, Hatchback',
//   transmission: 'Manual, Automatic',
//   bank: 'State Bank of India',
//   account: '••••4829',
// };

// const DOCS = ["Driver's License", 'Aadhar Card', 'Profile Photo'];

const VEHICLE_NAMES: Record<string, string> = {
    sedan: 'Sedan',
    suv: 'SUV',
    hatchback: 'Hatchback',
    luxury: 'Luxury',
};
const TRANSMISSION_NAMES: Record<string, string> = {
    manual: 'Manual',
    automatic: 'Automatic',
};

const names = (ids: string[], map: Record<string, string>) =>
    ids.map(id => map[id] ?? id).join(', ') || '-';

function Row({ label, value }: { label: string; value: string }) {
    return (
        <Text style={styles.rowLabel}>
            {label}: <Text style={styles.rowValue}>{value}</Text>
        </Text>
    );
}

function ReviewCard({
    title,
    onEdit,
    children,
}: {
    title: string;
    onEdit: () => void;
    children: React.ReactNode;
}) {
    return (
        <View style={styles.card}>
            <View style={styles.cardHead}>
                <Text style={styles.cardTitle}>{title}</Text>
                <Pressable onPress={onEdit} hitSlop={10}>
                    <MdiIcon
                        path={MDI_DOCS.squareEditOutline}
                        size={20}
                        color={colors.textSecondary}
                    />
                </Pressable>
            </View>
            <View style={styles.cardBody}>{children}</View>
        </View>
    );
}

function Check({
    checked,
    onToggle,
    children,
}: {
    checked: boolean;
    onToggle: () => void;
    children: React.ReactNode;
}) {
    return (
        <Pressable onPress={onToggle} style={styles.checkRow}>
            <View style={[styles.box, checked && styles.boxOn]}>
                {checked ? <MdiIcon path={MDI.check} size={14} color="#FFFFFF" /> : null}
            </View>
            <Text style={styles.checkText}>{children}</Text>
        </Pressable>
    );
}

export default function DriverReviewScreen({ navigation }: Props) {
    // Start unchecked so the driver gives consent on purpose.
    // (The design shows both ticked: use useState(true) to match it.)
    const [accurate, setAccurate] = useState(false);
    const [terms, setTerms] = useState(false);
    const p = useDriverProfile();
    const uploaded = useDriverDocuments();
    const uploadedDocs = DRIVER_DOCS.filter(d => uploaded[d.id]);

    const onSubmit = () => {
        // TODO: send the application to your API
        navigation.navigate('DriverVerificationPending');
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <DriverTitleBar title="Review Application" />

            <ScrollView
                style={styles.flex}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}>
                <DriverStepTitle title="Review & Submit" step={4} />

                <Text style={styles.heading}>Review & Submit</Text>
                <Text style={styles.subtitle}>
                    Please review your information carefully before submitting your
                    application.
                </Text>

                <ReviewCard
                    title="PERSONAL DETAILS"
                    onEdit={() => navigation.navigate('DriverPersonal')}>
                    <Row label="Full Name" value={p.name || '-'} />
                    <Row label="Phone" value={p.phone || '-'} />
                    <Row label="Email" value={p.email || '-'} />
                    <Row label="City" value={p.city || '-'} />
                    <Row label="Address" value={p.address || '-'} />
                </ReviewCard>

                <ReviewCard
                    title="PERSONAL DETAILS"
                    onEdit={() => navigation.navigate('DriverPersonal', { fromReview: true })}>
                    <Row label="Full Name" value={p.name || '-'} />
                    <Row label="Phone" value={p.phone || '-'} />
                    <Row label="Email" value={p.email || '-'} />
                    <Row label="City" value={p.city || '-'} />
                    <Row label="Address" value={p.address || '-'} />
                </ReviewCard>

                <ReviewCard
                    title="DRIVING EXPERIENCE"
                    onEdit={() => navigation.navigate('DriverExperience', { fromReview: true })}>
                    <Row label="Experience" value={p.experience ?? '-'} />
                    <Row label="License Type" value={p.license ?? '-'} />
                    <Row label="Vehicles" value={names(p.vehicles, VEHICLE_NAMES)} />
                    <Row label="Transmission" value={names(p.transmission, TRANSMISSION_NAMES)} />
                </ReviewCard>

                <ReviewCard
                    title="DOCUMENTS SUBMITTED"
                    onEdit={() => navigation.navigate('DriverDocuments')}>
                    {uploadedDocs.length === 0 ? (
                        <Row label="Documents" value="None uploaded yet" />
                    ) : (
                        uploadedDocs.map(d => (
                            <View key={d.id} style={styles.docRow}>
                                <Text style={styles.docName}>{d.title}</Text>
                                <View style={styles.verified}>
                                    <Text style={styles.verifiedText}>Uploaded</Text>
                                    <MdiIcon path={MDI.check} size={14} color={colors.primary} />
                                </View>
                            </View>
                        ))
                    )}
                </ReviewCard>

                <ReviewCard
                    title="BANK DETAILS"
                    onEdit={() => navigation.navigate('DriverPayout')}>
                    <Row label="Bank Name" value={p.bank ?? 'Not added yet'} />
                    <Row label="Account Number" value={p.account ?? '-'} />
                </ReviewCard>

                <SectionLabel title="DECLARATIONS & CONSENT" style={styles.declLabel} />
                <View style={styles.declCard}>
                    <Check checked={accurate} onToggle={() => setAccurate(v => !v)}>
                        I declare that all information provided is accurate and authentic to
                        the best of my knowledge.
                    </Check>
                    <Check checked={terms} onToggle={() => setTerms(v => !v)}>
                        I agree to the Terms of Service, Privacy Policy, and consent to a
                        secure driver background check.
                    </Check>
                </View>
            </ScrollView>

            <BottomBar>
                <ActionButton
                    title="Submit Application"
                    disabled={!(accurate && terms)}
                    onPress={onSubmit}
                />
            </BottomBar>
        </View>
    );
}

const styles = StyleSheet.create({
    flex: {
        flex: 1,
    },
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    content: {
        paddingHorizontal: 20,
        paddingTop: 8,
        paddingBottom: 28,
    },
    heading: {
        marginTop: 22,
        fontFamily: fonts.bold,
        fontSize: 22,
        lineHeight: 28,
        color: colors.textDark,
    },
    subtitle: {
        marginTop: 6,
        marginBottom: 6,
        fontFamily: fonts.regular,
        fontSize: 14,
        lineHeight: 21,
        color: colors.placeholder,
    },
    card: {
        marginTop: 14,
        padding: 16,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: CARD_BORDER,
        backgroundColor: colors.background,
    },
    cardHead: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    cardTitle: {
        fontFamily: fonts.bold,
        fontSize: 15,
        letterSpacing: 0.5,
        color: colors.primary,
    },
    cardBody: {
        marginTop: 12,
        gap: 6,
    },
    rowLabel: {
        fontFamily: fonts.regular,
        fontSize: 14,
        lineHeight: 20,
        color: colors.placeholder,
    },
    rowValue: {
        fontFamily: fonts.semiBold,
        color: colors.textSecondary,
    },
    docRow: {
        paddingLeft: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    docName: {
        fontFamily: fonts.regular,
        fontSize: 14,
        lineHeight: 20,
        color: colors.textDark,
    },
    verified: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    verifiedText: {
        marginRight: 4,
        fontFamily: fonts.bold,
        fontSize: 13,
        color: colors.primary,
    },
    declLabel: {
        marginTop: 26,
        marginBottom: 12,
    },
    declCard: {
        padding: 16,
        gap: 14,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: CARD_BORDER,
    },
    checkRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    box: {
        width: 20,
        height: 20,
        marginTop: 1,
        borderRadius: 5,
        borderWidth: 1.5,
        borderColor: colors.placeholder,
        alignItems: 'center',
        justifyContent: 'center',
    },
    boxOn: {
        borderColor: colors.primary,
        backgroundColor: colors.primary,
    },
    checkText: {
        flex: 1,
        marginLeft: 12,
        fontFamily: fonts.regular,
        fontSize: 13,
        lineHeight: 19,
        color: colors.placeholder,
    },
});