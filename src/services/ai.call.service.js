import Retell from "retell-sdk";

const retell = new Retell({
  apiKey: process.env.RETELL_API_KEY,
});

class RetellService {
  async callBorrower({
    borrowerId,
    loanId,
    borrowerName,
    phoneNumber,
    remainingAmount,
    dueDate,
  }) {
    const call = await retell.call.createPhoneCall({
      from_number: process.env.RETELL_FROM_NUMBER,
      to_number: phoneNumber,

      override_agent_id: process.env.RETELL_AGENT_ID,

      metadata: {
        borrowerId: String(borrowerId),
        loanId: String(loanId),
      },

      retell_llm_dynamic_variables: {
        customer_name: borrowerName,
        remaining_amount: String(remainingAmount),
        due_date: dueDate,
      },
    });

    return call;
  }
}

export const aiCallService = new RetellService();
