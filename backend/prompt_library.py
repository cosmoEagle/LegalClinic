from database import get_desc


class Prompt:
    ParseInstruction = """
        You are a legal assistant specializing in parsing and interpreting legal documents.\n
        Your role is to accurately extract key information such as definitions, obligations, rights, clauses, and relevant dates from legal texts.\n
        Ensure that your interpretations are precise, concise, and align with standard legal principles.\n
        Avoid providing opinions or advice; focus solely on the factual content within the document.\n
        Present information in a structured format, suitable for legal review or further processing.\n
    """

    evaluator = """
        You are a legal expert specializing in bail assessments.\n
        Your task is to systematically evaluate cases based on a structured decision tree approach, focusing on key factors such as offense classification, criminal history, flight risk, public safety threat, compliance history, health conditions, and legal representation.\n
        Your goal is to generate accurate and impartial recommendations regarding bail eligibility, considering all relevant legal criteria and judicial discretion.\n
        Provide recommendations that clearly outline eligibility for bail, potential bail conditions, or reasons for ineligibility, ensuring a comprehensive and fair analysis.\n
    """

    def ParsePrompt(text: str):
        return f"""
            Extract all acts and their respective sections from the following text.\n
            Format the output as a dictionary where each act is a key, and its sections are listed as an array of strings.\n
            If an act has multiple sections, list all sections associated with that act.\n
            Only parse secions from "Indian Penal Code" and "Code of Criminal Procedure".\n
            Put "Indian Penal Code" as IPC & "Code of Criminal Procedure" as CrPC
            Here's the text:\n
            {text}
        """

    def evalPrompt(kwargs):
        print(kwargs)
        prev = ""

        previous_case = kwargs.get("previous_case", "").lower().strip()
        prev_offence_acts = kwargs.get("prev_offence_acts", "")
        prev_sections_offence = kwargs.get("prev_sections_offence", "")

        if previous_case == "yes":
            prev = get_desc(prev_offence_acts, prev_sections_offence)

        return f"""
        Assess the eligibility for bail based on the following user-provided inputs. Follow the reasoning process outlined below to determine whether bail should be granted or denied, and under what conditions.

        Inputs Provided:
        
            {kwargs}
            
            Decision-Making Process:

            Step 1: Evaluate Offense and Arrest Details
            - Action: Determine the severity of the offense based on the sections under which the offender was arrested.
            - Reasoning: Consider the nature of the offense (bailable vs. non-bailable) and its seriousness.
            
            Step 2: Review Personal Circumstances
            - Action: Consider the age and gender of the accused.
            - Reasoning: Account for any special considerations that might apply (e.g., minors, pregnant women).
            
            Step 3: Analyze Previous Bail Application
            - Action: Check if the accused has applied for bail before.
                - If Allowed:
                    - Reasoning: Assess whether the terms and conditions were met.
                - If Not:
                    - Reasoning: Understand the grounds for rejection and the court's decision.
            
            Step 4: Assess Criminal History
            - Action: Review any previous cases involving the accused.
            - Reasoning: Evaluate the nature and sections of past offenses to determine any pattern of behavior.
            
            Step 5: Review Prison History
            - Action: Assess how many times the accused has already been in prison.
            - Reasoning: Consider the frequency of imprisonment to evaluate the likelihood of reoffending and overall behavior pattern.
            
            Step 6: Consider Health Information
            - Action: Review any medical conditions the accused may have.
            - Reasoning: Factor in whether health conditions warrant special consideration for bail.

            Step 7: Final Decision
            - Reasoning: Weigh all inputs and assess the overall eligibility for bail.
                - If Eligible: Recommend bail and suggest potential conditions.
                - If Not Eligible: Provide reasons for denial based on the factors evaluated."
        """
