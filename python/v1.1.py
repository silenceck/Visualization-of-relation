import os

# from nltk.parse.corenlp import CoreNLPParser
from nltk.parse.stanford import StanfordParser, StanfordDependencyParser
import math
from nltk.stem import WordNetLemmatizer
from nltk.tree import Tree
import random
import gensim
import operator
java_path = r"D:\Program Files\Hasleo\distributions\java\zulu8.21.0.1-jdk8.0.131\bin\java.exe"
model_path = r'C:\python\nlp\en.wiki.model'
filepath = 'cancer_smoke.xls'
os.environ['JAVAHOME'] = java_path
os.environ['STANFORD_PARSER'] = r'C:\python\nlp\stanford-parser-full-2018-02-27\stanford-parser.jar'
os.environ['STANFORD_MODELS'] = r'C:\python\nlp\stanford-parser-full-2018-02-27\stanford-parser-3.9.1-models.jar'
lemmatizer = WordNetLemmatizer()

verbs = []
be = ['am','is','are','was','were','been','being','be']
negwords = ['no', 'none', 'neither', 'never', 'little', 'few', 'not']
if os.path.exists('verbs0.4.txt'):
    with open('verbs0.4.txt', 'r', encoding='utf-8') as f1:
        for list in f1.readlines():
            verb = list.split( )
            verbs.append(verb)

else:
    #A -> B
    verbs.append(['account','bring','cause','spark','lead','led','increase','produce','affect','raise','create','predict','generate','engender','spawn','occasion', 'precipitate','prompt','provoke','trigger','induce','inspire','promote','foster', 'result', 'effect', 'decrease'])
    #A <- B
    verbs.append(['arise', 'come','issue','spring','stem', 'originate'])
    #
    verbs.append(['ascribe', 'attribute','impute'])
    #A - B
    verbs.append(['relate', 'associate', 'link', 'present', 'highlight','implicate','involve', 'correlate', 'connect', 'have' ,'believe', 'lack', 'diagnose'])

noun = ['cause', 'causes', 'reason', 'reasons','risk', 'risks','danger','dangers', 'association', 'effect', 'effects', 'symptom', 'symptoms', 'carcinogen', 'well-established', 'determinant', 'predictor', 'predictors', 'increase', 'decrease','increases', 'decreases', 'contributor']
noun2 = ['result', 'consequence', 'outcome', 'product', 'results', 'consequences', 'products']
relation_noun = ['relation', 'relations', 'association', 'assciations', 'link', 'links', 'bond', 'bonds', 'connection', 'connections', 'correlation', 'correlations','correspondence', 'prevalent']
adjv = ['positve', 'negative', 'positvely', 'negatively', 'harmful', 'harmfully', 'beneficial', 'beneficially', 'detrimental', 'detrimentally', 'good', 'bad', 'badly', 'ruinous', 'ruinously', 'unfavorable', 'attributable', 'contributing', 'associated', 'contributory']
# parser = CoreNLPParser(url="http://localhost:9000")
parser = StanfordParser(model_path=r"C:\python\nlp\stanford-english-corenlp-2018-02-27-models\edu\stanford\nlp\models\lexparser\englishPCFG.ser.gz")


list = [
        # "they think smoking is related with the increased risk of cancer.",
        # "They think smoking is predicted by cancer. ",
        # "They ascribe cancer to smoking.",
        # "Smoking is a cause of cancer.",
        # "They believe smoking is related with the increased risk of cancer.",
        # "cancer and smoke are harm to human." ,
        #  "smoking decrease cancer.",
        "Exposure to estrogens and alcohol consumption - the two only well-established risk factors for breast cancer - are capable of causing oxidative stress, which has been linked to progression of breast cancer.",
        "  In addition, COPD is known to be an important risk factor for lung cancer, irrespective of cigarette smoking."
]

dict = {}

def haskey(key, list):
    if isinstance(list, Tree):
        keys = key.split(' ')
        t = 0
        for k in keys:
            if k in list.leaves():
                t += 1
        if t == len(keys):
            return 1
        else:
            return 0
    elif isinstance(list, str):
        t = 0
        for item in key:
            if item in list:
                t+=1
        if t != 0:
            return 1
        else:
            return 0

def getPos(ind1, ind2):
    if(len(ind1) == 1 and len(ind2) == 1):
        return ind1[0], ind2[0]
    else:
        min = float('inf')
        i1 = -1
        i2 = -2
        for i in range(len(ind1)):
           for j in range(len(ind2)):
               if math.fabs(i - j) < min:
                    min = math.fabs(i - j)
                    i1 = i
                    i2 = j
    return i1, i2


# 记录句子中否定词数量， 是否是被动， 亦或者是否是系表结构;
# 返回三元组，<attri, verb, attrj>, <verb, attri, attrj>
# 如果动词为be动词，判断是否是被动语态亦或者是系表结构
# 记录否定词数量，判断是否为多重否定句
#
#
# 元组形式为    [verb, key1, key2, neg, whether, location, pas]
#
#           verb: 动词或词组
#             key1, key2: 关键词1，2
#             neg：否定情况
#             whether： 是否包含whether
#             loaction：verb 与关键词组位置关系
#                         1：verb位于关键词之前
#                         0：verb位于关键词之间
#            pas: 元组之间是否为被动
#

def get_triple_set(tree, key1, key2, whe):
    whether = whe
    triple = []
    pas = 0
    if whether != 1:
        word_attrs = tree[0].pos()
        if word_attrs[0][0] in ['Whether', 'whether']:
            whether = 1
    lens = len(tree) if len(tree) > 1 else 1
    for i in range(lens):
        neg = 0
        if haskey(key1, tree[i]) and haskey(key2, tree[i]):
            if tree[i].label() != 'VP':
                return None, whether
            else:
                word_attrs = tree[i].pos()
                pos1 = 0
                pos2 = 0
                ind1 = [j for j, x in enumerate(word_attrs) if word_attrs[j][0] == key1]
                ind2 = [j for j, x in enumerate(word_attrs) if word_attrs[j][0] == key2]
                pos1, pos2 = getPos(ind1, ind2)
                if word_attrs[0][0].lower() in ['Whether', 'whether']:
                    whether = 1
                for k in range(0, min(pos1, pos2)):
                    if word_attrs[i][1] in ['RB', 'CC'] and word_attrs[i][0] in negwords:
                        neg += 1
                    elif word_attrs[k][1] in ['DT', 'JJ', 'IN']:
                        if word_attrs[k][0] .lower() in negwords:
                            neg += 1
                    elif word_attrs[k][1]in ['VB', 'VBP', 'VBN', 'VBZ', 'VBD','VBG'] and word_attrs[k][0] not in ['-LRB-', '-RRB-', '-LSB-', '-RSB-']:
                        verb = lemmatizer.lemmatize(word_attrs[k][0], 'v')
                        for l in range(k+1, min(pos1, pos2)):
                            if word_attrs[k+1][0].lower() == 'whether':
                                whether = 1
                        if verb in be:
                            res, whether= be_case(word_attrs,k, key2, pos2, key1, pos1, neg, whether, pas)
                            if res is not None:
                                for item in res:
                                    triple.append(item)
                            break
                        else:
                            neg = neg % 2
                            for l in range(k+1, min(pos1, pos2)):
                                if word_attrs[l][0].lower() in relation_noun:
                                    verb = verb + ' ' + word_attrs[l][0]
                                    break
                            if pos1 < pos2:
                                triple.append([verb, key1, key2, neg, whether,0, 0])
                            else:
                                triple.append([verb, key2, key1, neg, whether,0, 0])
        elif i < lens -1  and haskey(key1, tree[i]) and haskey(key2, tree[i+1]):
            pos1 = 0
            if tree[i+1].label() != 'VP':
                return None, whether
            else:
                word_attrs = tree[i+1].pos()
                word_attrs1 = tree[i].pos()
                ind1 = [j for j, x in enumerate(word_attrs1) if word_attrs1[j][0] == key1]
                ind2 = [j for j, x in enumerate(word_attrs) if word_attrs[j][0] == key2]
                pos2 = ind2[0]
                pos1 = ind1[0]
                for k in range(0, pos1):
                    if word_attrs1[k][1] in ['RB', 'CC'] and word_attrs1[k][0].lower() in negwords:
                        neg+=1
                    if word_attrs1[k][1] in ['JJ', 'DT'] or word_attrs1[k][0].lower() in noun or word_attrs1[k][0].lower() in noun2 :
                        for l in range(k, pos1):
                            if word_attrs1[l][0].lower() in noun:
                                if word_attrs[0][1] in ['VB', 'VBP', 'VBN', 'VBZ', 'VBD','VBG'] and (word_attrs[0][0].lower() in be or word_attrs[0][0].lower() in ['include', 'including']):
                                    triple.append(['be risk', key2, key1, neg, whether, 1,0])
                            if word_attrs1[l][0].lower() in noun2:
                                if word_attrs[0][1] in ['VB', 'VBP', 'VBN', 'VBZ', 'VBD','VBG'] and (word_attrs[0][0].lower() in be or word_attrs[0][0].lower() in ['include', 'including']):
                                    triple.append(['be risk', key1, key2, neg, whether, 1,0])
                        break
                for k in range(0, pos2):
                    if word_attrs[k][1] in ['RB', 'CC'] and word_attrs[k][0].lower() in negwords:
                        neg += 1
                    elif word_attrs[k][1] in ['DT', 'JJ', 'IN']:
                        if word_attrs[k][0].lower() in negwords:
                            neg += 1
                    if word_attrs[k][1] in ['VB', 'VBP', 'VBN', 'VBZ', 'VBD','VBG'] and word_attrs[k][0] not in ['-LRB-', '-RRB-', '-LSB-', '-RSB-']:
                        verb = lemmatizer.lemmatize(word_attrs[k][0], 'v')
                        for l in range(k+1, pos2):
                            if word_attrs[l][0].lower() == 'whether':
                                whether = 1
                        if verb in be:
                            res,whether = be_case(word_attrs, k, key2, pos2, key1, 0, neg, whether, pas)
                            if res is not None:
                                for item in res:
                                    triple.append(item)
                            break
                        else:
                            neg = neg % 2
                            for l in range(k+1, pos2):
                                if word_attrs[l][0].lower() in noun or word_attrs[l][0].lower() in noun2 or word_attrs[l][0].lower() in relation_noun or word_attrs[l][0].lower() in adjv:
                                    verb = verb + " " + word_attrs[l][0]
                            triple.append([verb, key1, key2, neg, whether, 1, pas])
        elif i < lens-2 and haskey(key1, tree[i]) and len(tree[i+1].pos()) == 1 and haskey(key2, tree[i+2]):
            word_attrs = tree[i].pos()
            word_attrs2 = tree[i+2].pos()
            pos1 = 0
            pos2 = 0
            tagn = 0
            tago = 0
            tag1 = 0
            ind1 = [j for j, x in enumerate(word_attrs) if word_attrs[j][0] == key1]
            ind2 = [j for j, x in enumerate(word_attrs2) if word_attrs2[j][0] == key2]
            pos1, pos2 = getPos(ind1, ind2)
            if tree[i+2].label() != 'VP':
                for j in range(0, pos1):
                    if word_attrs[j][1] in ['RB', 'CC'] and word_attrs[j][0].lower() in negwords:
                        neg += 1
                    elif word_attrs[j][1] in ['DT', 'JJ', 'IN']:
                        if word_attrs[j][0].lower() in negwords:
                            neg += 1
                    if word_attrs[j][0].lower() in noun or word_attrs[j][0] in noun2:
                        if word_attrs[j][0].lower() in noun:
                            tagn = 1
                            for k in range(j + 1, pos1):
                                if word_attrs[k][0].lower() in ['of']:
                                    tago = 1
                            break
                        elif word_attrs[j][0].lower() in noun2:
                            tag1 = 1
                            for k in range(j + 1, pos1):
                                if word_attrs[k][0] in ['of']:
                                    tago = 1
                            break
                if tagn != 0 and tago != 0:
                    triple.append(["be risk", key2, key1, neg, whether, 1, 0])
                elif tag1 != 0 and tago != 0:
                    triple.append(["be risk", key1, key2, neg, whether, 1, 0])
            else:
                for k in range(0, pos1):
                    if word_attrs[k][1] in ['RB', 'CC'] and word_attrs[k][0].lower() in negwords:
                        neg+=1
                for k in range(0, pos2):
                    if word_attrs2[k][1] in ['RB', 'CC'] and word_attrs2[k][0].lower() in negwords:
                        neg += 1
                    elif word_attrs2[k][1] in ['DT', 'JJ', 'IN']:
                        if word_attrs2[k][0].lower() in negwords:
                            neg += 1
                    if word_attrs2[k][1] in ['VB', 'VBP', 'VBN', 'VBZ', 'VBD','VBG'] and word_attrs2[k][0] not in ['-LRB-', '-RRB-', '-LSB-', '-RSB-']:
                        verb = lemmatizer.lemmatize(word_attrs2[k][0], 'v')
                        for l in range(k+1, pos2):
                            if word_attrs2[l][0].lower() == 'whether':
                                whether = 1
                        if verb in be:
                            res,whether = be_case(word_attrs2, k, key2, pos2, key1, 0, neg, whether, pas)
                            if res is not None:
                                for item in res:
                                    triple.append(item)
                            break
                        else:
                            neg = neg % 2
                            for l in range(k+1, pos2):
                                if word_attrs2[l][0].lower() in noun or word_attrs2[l][0].lower() in noun2 or word_attrs2[l][0].lower() in relation_noun or word_attrs2[l][0].lower() in adjv:
                                    verb = verb + " " + word_attrs2[l][0]
                            triple.append([verb, key1, key2, neg, whether, 1, pas])
        elif i < lens -1 and haskey(key2, tree[i]) and haskey(key1, tree[i+1]):
            pos2 = 0
            if tree[i+1].label() != 'VP':
                return None, whether
            else:
                word_attrs = tree[i + 1].pos()
                word_attrs1 = tree[i].pos()
                ind1 = [j for j, x in enumerate(word_attrs) if word_attrs[j][0] == key1]
                ind2 = [j for j, x in enumerate(word_attrs1) if word_attrs1[j][0] == key2]
                pos1 = ind1[0]
                pos2 = ind2[0]
                for k in range(0, pos2):
                    if word_attrs1[k][1] in ['RB', 'CC'] and word_attrs1[k][0].lower() in negwords:
                        neg += 1
                    if word_attrs1[k][1] in ['JJ', 'DT'] or word_attrs1[k][0].lower() in noun or word_attrs1[k][0].lower() in noun2:
                        for l in range(k, pos2):
                            if word_attrs1[l][0].lower() in noun:
                                if word_attrs[0][1] in ['VB', 'VBP', 'VBN', 'VBZ', 'VBD','VBG'] and (word_attrs[0][0].lower() in be or word_attrs[0][0].lower() in ['include', 'including']):
                                    triple.append(['be risk', key1, key2, neg, whether, 1,0])
                            if word_attrs1[l][0].lower() in noun2:
                                if word_attrs[0][1] in ['VB', 'VBP', 'VBN', 'VBZ', 'VBD','VBG'] and (word_attrs[0][0].lower() in be or word_attrs[0][0].lower() in ['include', 'including']):
                                    triple.append(['be risk', key2, key1, neg, whether, 1,0])
                        break
                for k in range(0, pos1):
                    if word_attrs[i][1] in ['RB', 'CC'] and word_attrs[i][0].lower() in negwords:
                        neg += 1
                    elif word_attrs[k][1] in ['DT', 'JJ', 'IN']:
                        if word_attrs[k][0].lower() in negwords:
                            neg += 1
                    if word_attrs[k][1] in ['VB', 'VBP', 'VBN', 'VBZ', 'VBD','VBG'] and word_attrs[k][0] not in ['-LRB-', '-RRB-', '-LSB-', '-RSB-']:
                        verb = lemmatizer.lemmatize(word_attrs[k][0], 'v')
                        for l in range(k+1, pos1):
                            if word_attrs[k+1][0].lower() == 'whether':
                                whether = 1
                        if verb in be:
                            res,whether = be_case(word_attrs, k, key2, 0, key1, pos1, neg, whether, pas)
                            if res is not None:
                                for item in res:
                                    triple.append(item)
                            if len(res) != 0:
                                break
                        else:
                            neg = neg % 2
                            for l in range(k + 1, pos1):
                                if word_attrs[l][0].lower() in noun or word_attrs[l][0] in noun2 or word_attrs[l][0] in relation_noun or word_attrs[l][0] in adjv:
                                    verb = verb + " " + word_attrs[l][0]
                            triple.append([verb, key2, key1, neg, whether, 1, pas])
        elif i < lens-2 and haskey(key2, tree[i]) and len(tree[i+1].pos()) == 1 and haskey(key1, tree[i+2]):
            word_attrs = tree[i].pos()
            word_attrs2 = tree[i + 2].pos()
            pos1 = 0
            pos2 = 0
            tagn = 0
            tago = 0
            tag1 = 0
            ind1 = [j for j, x in enumerate(word_attrs) if word_attrs[j][0] == key2]
            ind2 = [j for j, x in enumerate(word_attrs2) if word_attrs2[j][0] == key1]
            pos1, pos2 = getPos(ind1, ind2)
            if tree[i+2].label()!='VP':
                for j in range(0, pos1):
                    if word_attrs[j][1] in ['RB', 'CC'] and word_attrs[j][0].lower() in negwords:
                        neg += 1
                    elif word_attrs[j][1] in ['DT', 'JJ', 'IN']:
                        if word_attrs[j][0].lower() in negwords:
                            neg += 1
                    if word_attrs[j][0].lower() in noun or word_attrs[j][0].lower() in noun2:
                        if word_attrs[j][0].lower() in noun:
                            tagn = 1
                            for k in range(j + 1, pos1):
                                if word_attrs[k][0] in ['of']:
                                    tago = 1
                            break
                        elif word_attrs[j][0].lower() in noun2:
                            tag1 = 1
                            for k in range(j + 1, pos1):
                                if word_attrs[k][0] in ['of']:
                                    tago = 1
                            break
                    if tagn != 0 and tago != 0:
                        triple.append(["be risk", key1, key2, neg, whether, 1, pas])
                    elif tag1 != 0 and tago != 0:
                        triple.append(["be risk", key2, key1, neg, whether, 1, pas])
            else:
                for k in range(0, pos1):
                    if word_attrs[k][1] in ['RB', 'CC'] and word_attrs[k][0].lower() in negwords:
                        neg+=1
                for k in range(0, pos2):
                    if word_attrs2[k][1] in ['RB', 'CC'] and word_attrs2[k][0].lower() in negwords:
                        neg += 1
                    elif word_attrs2[k][1] in ['DT', 'JJ', 'IN']:
                        if word_attrs2[k][0].lower() in negwords:
                            neg += 1
                    if word_attrs2[k][1] in ['VB', 'VBP', 'VBN', 'VBZ', 'VBD','VBG'] and word_attrs2[k][0] not in ['-LRB-', '-RRB-', '-LSB-', '-RSB-']:
                        verb = lemmatizer.lemmatize(word_attrs2[k][0], 'v')
                        for l in range(k+1, pos2):
                            if word_attrs2[l][0].lower() == 'whether':
                                whether = 1
                        if verb in be:
                            res,whether = be_case(word_attrs2, k, key2, pos2, key1, 0, neg, whether, pas)
                            if res is not None:
                                for item in res:
                                    triple.append(item)
                            if len(res) != 0:
                                break
                        else:
                            neg = neg % 2
                            for l in range(k+1, pos2):
                                if word_attrs2[l][0].lower() in noun or word_attrs2[l][0].lower() in noun2 or word_attrs2[l][0].lower() in relation_noun or word_attrs2[l][0].lower() in adjv:
                                    verb = verb + " " + word_attrs2[l][0]
                            triple.append([verb, key2, key1, neg, whether, 1, pas])

    return triple, whether



# 首先判断该句是被动语态还是系表结构
# 如果是系表结构则 返回元组中的 verb项为 be动词和表语
# 如果是被动语态 则返回相应元组
# 如果关键词之间存在多个动词，离be动词远的不认为是被动语态

def be_case(word_attrs, index, key2, pos2, key1, pos1, neg = 0, whether = 0, pas = 0):
    nc = 0
    nv = 0
    triple = []
    id_noun = 0
    if pos1 == 0 and pos2 == 0:
        return None, whether
    elif pos1 != 0 and pos2 != 0:
        for i in range(index + 1, min(pos1, pos2)):
            # print(word_attrs[i][1])
            if word_attrs[i][1] == ['RB', 'CC'] and word_attrs[i][0].lower() in negwords:
                neg += 1
            if word_attrs[i][1] in ['DT', 'JJ', 'IN']:
                if word_attrs[i][0].lower() in negwords:
                    neg+=1
            if word_attrs[i][1] in ['NN', 'NNS', 'JJ', 'RB']:
                if word_attrs[i][0].lower() in noun or word_attrs[i][0] in relation_noun or word_attrs[i][0] in word_attrs[i][0] in adjv:
                    id_noun = i
                    nc += 1
            elif word_attrs[i][0].lower() == 'whether':
                whether += 1
            elif word_attrs[i][1] == 'VBN' and word_attrs[i][0] not in ['-LRB-', '-RRB-', '-LSB-', '-RSB-']:
                pas = 1
                nv += 1
                verb = lemmatizer.lemmatize(word_attrs[i][0], 'v')
                if verb not in be:
                    if pos1 < pos2:
                        triple.append([verb, key1, key2, neg, whether,0, 1])
                    else:
                        triple.append([verb, key2, key1, neg, whether,0, 1])
        if nv == 0:
            if nc != 0:
                verb = 'be ' + word_attrs[id_noun][0]
                if pos1 < pos2:
                    triple.append([verb, key1, key2, neg, whether,0, 0])
                else:
                    triple.append([verb, key2, key1, neg, whether, 0, 0])
    elif pos1 == 0 :
        for i in range(index + 1, pos2):
            if word_attrs[i][1] in ['RB', 'CC'] and word_attrs[i][0].lower() in negwords:
                neg += 1
            if word_attrs[i][1] in ['DT', 'JJ', 'IN']:
                if word_attrs[i][0].lower() in negwords:
                    neg += 1
            if word_attrs[i][1] in ['NN', 'NNS', 'JJ', 'RB']:
                if word_attrs[i][0].lower()  in noun or word_attrs[i][0].lower() in relation_noun or word_attrs[i][0].lower()  in word_attrs[i][0].lower()  in adjv:
                    id_noun = i
                    nc += 1
            if word_attrs[i][0].lower()  == 'whether':
                whether += 1
            elif word_attrs[i][1] == 'VBN' and word_attrs[i][0] not in ['-LRB-', '-RRB-', '-LSB-', '-RSB-']:
                verb = lemmatizer.lemmatize(word_attrs[i][0], 'v')
                triple.append([verb, key1, key2, neg, whether,1, 1])
                nv += 1
                for j in range(i+1, pos2):
                    if word_attrs[j][1] in ['VB', 'VBP', 'VBN', 'VBZ', 'VBD','VBG'] and word_attrs[i][0] not in ['-LRB-', '-RRB-', '-LSB-', '-RSB-']:
                        verb = lemmatizer.lemmatize(word_attrs[j][0], 'v')
                        # if word_attrs[j+1][0]
                        triple.append([verb, key1, key2, neg, whether, 1, 0])
                    if word_attrs[j][0].lower()  in noun or word_attrs[j][0].lower()  in relation_noun or word_attrs[j][0].lower()  in word_attrs[j][0].lower()  in adjv:
                        verbs = verb + " " + word_attrs[j][0]
                        triple.append([verbs, key1, key2, neg, whether, 1, 0])
                break
        if nv == 0:
            if nc != 0:
                verb = 'be ' + word_attrs[id_noun][0]
                triple.append([verb, key1, key2, neg, whether, 1, 0])

    elif pos2 == 0:
        for i in range(index + 1, pos1):
            if word_attrs[i][1] in ['RB', 'CC'] and word_attrs[i][0].lower() in negwords:
                neg += 1
            if word_attrs[i][1] in ['DT', 'JJ', 'IN']:
                if word_attrs[i][0].lower()  in negwords:
                    neg += 1
            if word_attrs[i][1] in ['NN', 'NNS', 'JJ', 'RB']:
                if word_attrs[i][0].lower()  in noun or word_attrs[i][0].lower()  in relation_noun or word_attrs[i][0].lower()  in word_attrs[i][0].lower()  in adjv:
                    id_noun = i
                    nc += 1
            elif word_attrs[i][0].lower()  == 'whether':
                whether += 1
            elif word_attrs[i][1] == 'VBN' and word_attrs[i][0] not in ['-LRB-', '-RRB-', '-LSB-', '-RSB-']:
                verb = lemmatizer.lemmatize(word_attrs[i][0], 'v')
                triple.append([verb, key2, key1, neg, whether, 1, 1])
                nv +=1
                for j in range(i + 1, pos1):
                    if word_attrs[j][1] in ['VB', 'VBP', 'VBN', 'VBZ', 'VBD','VBG'] and word_attrs[i][0] not in ['-LRB-', '-RRB-', '-LSB-', '-RSB-']:
                        verb = lemmatizer.lemmatize(word_attrs[j][0], 'v')
                        triple.append([verb, key2, key1, neg, whether, 1, 0])
                    if word_attrs[j][0].lower()  in noun or word_attrs[j][0].lower()  in relation_noun or word_attrs[j][0].lower()  in word_attrs[j][0].lower()  in adjv:
                        verbs = verb + " " + word_attrs[j][0]
                        triple.append([verbs, key2, key1, neg, whether, 1, 0])
                break
        if nv == 0:
            if nc != 0:
                verb  = 'be '+ word_attrs[id_noun][0]
                triple.append([verb, key2, key1, neg, whether,1, 0])
    return triple, whether


# 被动语态元组提取
# 首先确定关键词位置，根据关键词语位置判断
# def passive(word_attrs, index, pos2, pos1, neg, whether, pas):
#     if pos1 != 0 and pos2 != 0:
#         pass
#     elif pos1 != 0:
#
#     elif pos2 != 0:
#         pass



# triple : [verb, attri, attrj, neg, whether, locate pas]
#           attri 和 attrj 之间有顺序关系
#           neg：句子中否定词个数
#           whether：句子是否是whether开头
#           locate: 句子中动词与两个关键词的位置关系，1：之间， 0：之前
#           pas 句子是否是被动语态
#  ret：0，1，2，3
#   0：attri和attrj之间无关
#   1/2：attri和attrj之间存在因果关系，具体结果要看neg， whether， pas 以及verv分类状态
#   3： attri 和 attrj之间存在相关关系，但意义未明

def getRelation(triple):
    verb = triple[0]
    whether = triple[4]
    neg = triple[3]
    loc = triple[5]
    category = -1
    pas = triple[-1]
    phrease = verb.split(' ') if ' ' in verb else []
    if phrease == []:
        for i in range(len(verbs)):
            if verb in verbs[i]:
                category = i
    else:
        if phrease[0] not in be:
            for i in range(len(verbs)):
                if phrease[0] in verbs[i]:
                    category = i
        else:
            category = 4

    if whether != 0:
        return 0
    else:
        if phrease == []:
            if loc == 1:
                if neg == 1:
                    return 0
                elif neg == 0 and pas == 0:
                    if category == 0:
                        return 1
                    elif category == 1:
                        return 2
                    elif category == 3:
                        return 3
                    else:
                        return 0
                elif neg == 0 and pas == 1:
                    if category == 0 or category == 1 or category == 2:
                        return 2
                    elif category == 3:
                        return 3
                    else:
                        return 0
            elif loc == 0:
                if neg == 1:
                    return 0
                elif neg == 0 and pas == 0:
                    if category == 0 or category == 1:
                        return 0
                    elif category == 2:
                        return 2
                    elif category == 3:
                        return 0
                    else:
                        return 0
                elif neg == 0 and pas == 1:
                    if category == 0:
                        return 0
                    elif category == 0 and category == 1 and category == 2:
                        return 0
                    elif category == 3:
                        if verb in ['associate', 'know']:
                            return 0
                        else:
                            return 3
                    else:
                        return 0
        elif phrease != []:
            if loc == 1:
                if neg == 1:
                    return 0
                elif neg == 0 and pas == 0:
                    if category == 0:
                        return 1
                    elif category == 1:
                        return 2
                    elif category == 3 or category== 4:
                        if phrease[1] in noun:
                            return 1
                        elif phrease[1] in relation_noun or phrease[1] in adjv or phrease[1] in noun2:
                            if phrease[1] in ['harmful', 'harmfully', 'beneficial', 'beneficially', 'detrimental', 'detrimentally', 'good', 'bad', 'badly', 'ruinous', 'ruinously','unfavorable', 'development', 'responsible', 'contributing', 'associated', 'contributory']:
                                return 1
                            elif phrease[1] in relation_noun or phrease[1] in ['positive', 'negetive', 'positively', 'negetively']:
                                return 3
                            elif phrease[1] in noun2 or phrease[1] in ['attributable']:
                                return 2
                    else:
                        return 0
                elif neg == 0 and pas == 1:
                    if category == 0 or category == 1 or category == 2:
                        return 2
                    else:
                        return 0
            elif loc == 0:
                if neg == 1:
                    return 0
                elif neg == 0 and pas == 0:
                    if category == 0 or category == 1:
                        return 0
                    elif category == 2:
                        return 2
                    elif category == 3:
                        if verb in ['asscociate', 'know']:
                            return 0
                        if phrease[1] in relation_noun:
                            return 3
                        else:
                            return 0
                    else:
                        return 0
                elif neg == 0 and pas == 1:
                    if category == 0:
                        return 0
                    elif category == 0 and category == 1 and category == 2:
                        return 0
                    elif category == 3:
                        if verb in ['asscociate', 'know']:
                            return 0
                        if phrease[1] in relation_noun:
                            return 3
                        else:
                            return 0
                    else:
                        return 0
    return 0





##  step1. 分别计算每个提取出的三元组中的动词与动词组的相似度最值, 并保存该元组中动词的分组
##  step2. 将步骤1中的相似度最大的动词加入到对应分组中
##  step3. 将剩下的动词分别与刚添加进去的动词进行相似度比较，如果大于该动词之前的相似度值，则替换相似度值与分组情况
##  step4. 将步骤3中相似度最大的动词添加到对应分组中
##  step5. 重复执行步骤3-4，直到没有新的动词为止
def calculate_similarity(verb, verb2 = {}, num = 0,):
    if num == 0:
        exist = 0
        for item in verbs:
            if verb in item:
                exist += 1
        i = 1
        index = -1
        maxSims = 0
        sims = []
        if verb not in dict.keys() and exist == 0:
            i = 0
            try:
                for seed in verbs:
                    sim = []
                    for x in seed:
                        v = model.similarity(x, verb)
                        if v > 0.4:
                            sim.append(v)
                    if len(sim) > 0:
                        sim = sorted(sim, reverse=True)
                        sims.append(sim)
                    elif len(sim) == 0:
                        sims.append([0])
                        i+=1
                if i != 4:
                    maxSims, index = getMax(sims)
                if index != -1:
                    dict[verb] = [maxSims, index]
            except KeyError as e:
                print(e)

    else:
        max = float("-inf")
        try:
            for item in verb2:
                value = model.similarity(item, verb)
                if value > verb2[item][0] and value > 0.4:
                    max = value
                    id = dict[item][1]
                    if(dict[item][0] < max):
                        dict[item] = [max, id]
        except KeyError as e:
            print(e)


## 添加动词到词库中
def insertOrder(dict):
    if len(dict) > 0:
        tups = sorted(dict.items(), key=operator.itemgetter(1), reverse=True)
        value = tups[0][1][0]
        i = 0
        verbs_next = [] #动词词语
        while i < len(tups) and tups[i][1][0] == value:
            verbs[tups[i][1][1]].append(tups[i][0])
            i += 1
        while len(dict) != 0:
            j = 0
            tups = sorted(dict.items(), key=operator.itemgetter(1), reverse=True)
            verb = []
            value = tups[0][1][0]
            while j < len(tups) and tups[j][1][0] == value:
                verbs[tups[j][1][1]].append(tups[j][0])
                verb.append(tups[j][0])
                del (dict[tups[j][0]])
                j+=1
            for item in verb:
                calculate_similarity(item, dict, 1)



def getMax(sims):
    index = -1
    list = []
    for i in range(len(sims)):
        list.append(sims[i][0])
    v = max(list)
    ind = [i for i, x in enumerate(list) if x == v]
    if len(ind) <= 0:
        return 0, index
    elif len(ind) == 1:
        return sims[ind[0]][0], ind[0]
    else:
        tempLists = []
        lens = len(ind)
        l = []
        for i in range(lens):
            l.append(len(sims[ind[i]]))
        value = max(l)
        inds = [i for i, x in enumerate(l) if x == value]
        if len(inds) == len(ind):
            return sims[ind[0]][0], math.floor(random.uniform(0,3))
        for i in range(len(ind)):
            tempList = sorted(sims[ind[i]], reverse=True)
            if len(sims[ind[i]]) > 1:
                tempLists.append(tempList[1:])
            else:
                tempLists.append([0])
        i = 1
        while i < min([len(x) for x in tempLists]):
            v = [sims[x][i] for x in range(len(ind))]
            index = [i for i, x in enumerate(v) if x == max(v)]
            if len(index) == 1:
                return max(sims[ind[v.index(max(v))]]), ind[v.index(max(v))]
            else:
                return max(sims[ind[v.index(max(v))]]), ind[v.index(max(v))]


def extractRelation(list):
    if list != []:
        r = []
        for item in list:
            if item[0] == 'keyword1' and item[1] == 'keyword2':
                r.append(item[-1])
            elif item[0] == 'keyword2' and item[1] == 'keyword1':
                if item[-1] == '1':
                    res = '2'
                elif item[-1] == '2':
                    res = '1'
                else:
                    res = item[-1]
                r.append(res)
        if max(r) == '0':
            return 0
        elif '1' in r and '2' not in r:
            return 1
        elif '1' not in r and '2' in r:
            return 2
        elif '1' in r and '2' in r:
            return random.randint(1,2)
        else:
            return 3
    else:
        return 0


attrs = {
    'cancer':['cancers', 'cancer', 'Cancer', 'Cancers', 'tumor', 'Tumor', 'tumors', 'Tumors'],
    'smoke':['smoke', 'smoking', 'shs', 'Smoke', 'Smoking', 'SHS'],
    'alcohol':['alcohol', 'Alcohol'],
    'heart disease':['heart attack', 'heart disease', 'Heart attack', 'Heart disease'],
    'heart attack':['heart attack', 'heart disease', 'Heart attack', 'Heart disease'],
    'hypertension':['hypertension', 'HTN', 'htn', 'Hypertension'],
    'stroke':['stroke', 'Stroke'],
    'weight':['weight', 'Weight', 'Overweight', 'overweight'],
    'depression':['depression', 'Depression', 'dysthymia', 'Dysthymia'],
    'dysthymia':['depression', 'Depression', 'Dysthymia'],
    'diabetes':['diabetes', 'Diabetes'],
    'systolic blood pressure':['Systolic blood pressure', 'systolic blood pressure'],
    'heart rate':['heart rate', 'Heart rate'],
    'height':['height'],
    'eyesight':['eyesight', 'Eyesight']
}


model = gensim.models.word2vec.Word2Vec.load(model_path)
# oriDir = 'C:\\python\\nlp\\select\\handle0.5'
# filenames = [x for x in os.listdir(oriDir) if os.path.isfile(os.path.join(oriDir, x))]
# for filename in filenames:
#     print(filename)
#     name = os.path.splitext(filename)[0]
#     keys = name.split('_')
#     key1 = keys[0]
#     key2 = keys[1]
#     filepath = os.path.join(oriDir, filename)
#     data = xlrd.open_workbook(filepath)
#     table = data.sheets()[0]
#     rows = table.nrows
#     index = 0
#     keyword1 = attrs[key1]
#     keyword2 = attrs[key2]
#     triple_sets = []
#     wbk = xlwt.Workbook(encoding='utf-8', style_compression=0)
#     sheet = wbk.add_sheet('sheet 1', cell_overwrite_ok=True)
#     j = -1
#     for i in range(rows):
#         sentence = table.cell(i, 0).value
#         triple_set = []
#         j += 1
#         if haskey(keyword1, sentence) and haskey(keyword2, sentence):
#             s = sentence
#             for keyword in keyword1:
#                 if keyword in sentence:
#                     s = s.replace(keyword, 'keyword1')
#             for keyword in keyword2:
#                 if keyword in sentence:
#                     s = s.replace(keyword, 'keyword2')
#             print('sentence:', s)
#             tree = parser.raw_parse(s)
#             whether = 0
#             for items in tree:
#                 for sent in items.subtrees(lambda t: t.label() in ['S', 'SBAR']):
#                     word_attrs = sent.pos()
#                     # print(type(sent))
#                     ind1 = [i for i, x in enumerate(word_attrs) if word_attrs[i][0] == 'keyword1']
#                     ind2 = [i for i, x in enumerate(word_attrs) if word_attrs[i][0] == 'keyword2']
#
#                     # print(word_attrs)
#                     if len(ind1) != 0 and len(ind2) != 0 and ind1[0] != ind2[0]:
#                         res, whether = get_triple_set(sent, 'keyword1', 'keyword2', whether)
#                         if res is not None:
#                             for item in res:
#                                 if whether == 1:
#                                     item[-3] = 1
#                                 triple_set.append(item)
#             triple_sets.append(triple_set)
#         else:
#             triple_sets.append([])
#         print("processing " + str(i + 1) + "-th data...")
#         print(j)
#         sheet.write(j, 0, sentence)
#         sheet.write(j, 1, table.cell(i, 1).value)
#         # print(sentence)ww
#         # print(sentence)ww
#     print(len(triple_sets))
#     # model = gensim.models.word2vec.Word2Vec.load(model_path)
#     index_sen = 0  #
#     for sets in triple_sets:
#         if sets == []:
#             continue
#         else:
#             for item in sets:
#                 if ' ' not in item[0]:
#                     if item[0] == '-LSB-':
#                         print(sets)
#                     calculate_similarity(item[0], dict, 0)
#                     # print(dict)
#
#     insertOrder(dict)
#
#     res = []
#     results = []
#     for sets in triple_sets:
#         r = []
#         if set == []:
#             res.append(0)
#         else:
#             for item in sets:
#                 reltaion = getRelation(item)
#                 r.append([item[1], item[2], str(reltaion)])
#             res.append(r)
#     for item in res:
#         r = extractRelation(item)
#         results.append(r)
#
#     # data = xlrd.open_workbook('sen.xls')
#     # table = data.sheets()[0]
#     # rows = table.nrows
#     # wbk = xlwt.Workbook(encoding='utf-8', style_compression=0)
#     # sheet = wbk.add_sheet('sheet 2', cell_overwrite_ok=True)
#     if len(results) == j + 1:
#         for i in range(j + 1):
#             # print(table.cell(i, 0).value)
#             # print(results[i])
#             sheet.write(i, 2, results[i])
#     else:
#         print("error")
#     savedPath = "C:\\python\\nlp\select\\handle0.4.1\\" + key1 + "_" + key2 + '.xls'
#     wbk.save(savedPath)
#     # file = '1111.xls'\
#
# with open('verbs0.4.txt', 'w') as file:
#     for verb in verbs:
#         for x in verb:
#             file.write(x + " ")
#         file.write("\n")


def process_text(text):
    key1 = 'alcohol'
    key2 = 'depression'
    keyword1 = attrs[key1]
    keyword2 = attrs[key2]
    sentence = text
    triple_sets = []
    triple_set = []
    if haskey(keyword1, sentence) and haskey(keyword2, sentence):
        s = sentence
        for keyword in keyword1:
            if keyword in sentence:
                s = s.replace(keyword, 'keyword1')
        for keyword in keyword2:
            if keyword in sentence:
                s = s.replace(keyword, 'keyword2')
        print('sentence:', s)
        tree = parser.raw_parse(s)
        whether = 0
        for items in tree:
            for sent in items.subtrees(lambda t: t.label() in ['S', 'SBAR']):
                word_attrs = sent.pos()
                # print(type(sent))
                ind1 = [i for i, x in enumerate(word_attrs) if word_attrs[i][0] == 'keyword1']
                ind2 = [i for i, x in enumerate(word_attrs) if word_attrs[i][0] == 'keyword2']

                # print(word_attrs)
                if len(ind1) != 0 and len(ind2) != 0 and ind1[0] != ind2[0]:
                    res, whether = get_triple_set(sent, 'keyword1', 'keyword2', whether)
                    if res is not None:
                        for item in res:
                            if whether == 1:
                                item[-3] = 1
                            triple_set.append(item)
        triple_sets.append(triple_set)
    else:
        triple_sets.append([])
    for sets in triple_sets:
        if sets == []:
            continue
        else:
            for item in sets:
                if ' ' not in item[0]:
                    if item[0] == '-LSB-':
                        print(sets)
                    calculate_similarity(item[0], dict, 0)
                    # print(dict)

    insertOrder(dict)
    res = []
    results = []
    for sets in triple_sets:
        r = []
        if set == []:
            res.append(0)
        else:
            for item in sets:
                reltaion = getRelation(item)
                r.append([item[1], item[2], str(reltaion)])
            res.append(r)
    for item in res:
        r = extractRelation(item)
        results.append(r)

    for i in range(len(results)):
        print(results[i])

if __name__ == "__main__":
    text = "Indeed, individuals prenatally exposed to alcohol \
    have an increased risk of developing anxiety and depression."
    process_text(text)