import { requireAuth } from "@/lib/auth";
import { getSimpleConversationMessages } from "@/lib/services/conversations-simple";
import { SimpleConversationPageClient } from "@/components/conversations/simple-conversation-page-client";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

interface ConversationPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ConversationPage({
  params,
}: ConversationPageProps) {
  const session = await requireAuth();
  const { id } = await params;
  const { t } = useTranslation();

  try {
    const messages = await getSimpleConversationMessages(id, session.user.id);

    return (
      <SimpleConversationPageClient
        conversationId={id}
        initialMessages={messages}
        currentUserId={session.user.id}
      />
    );
  } catch (error) {
    console.error("Error loading conversation:", error);

    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="text-center max-w-md">
          <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">{t('conversations.errorTitle')}</h3>
          <p className="text-muted-foreground mb-4">
            {t('conversations.errorDescription')}
          </p>
          <div className="bg-muted p-4 rounded-lg text-sm text-left mb-4">
            <p className="font-medium mb-2">{t('conversations.fixInstructionsTitle')}</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>
                {t('conversations.fixInstruction1')}{" "}
                <code className="bg-background px-1 rounded">
                  node scripts/fix-conversations-rls.js
                </code>
              </li>
              <li>{t('conversations.fixInstruction2')}</li>
              <li>{t('conversations.fixInstruction3')}</li>
              <li>{t('conversations.fixInstruction4')}</li>
            </ol>
          </div>
          <Button asChild>
            <Link href="/conversations">{t('conversations.backToConversations')}</Link>
          </Button>
        </div>
      </div>
    );
  }
}
