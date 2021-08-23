#!/usr/bin/env python
# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function
import time
import sys
import os
try:
    from urllib import quote  # Python 2.X
except ImportError:
    from urllib.parse import quote  # Python 3+
from optparse import OptionParser


_base_path = os.path.abspath(os.path.dirname(__file__))
date = time.strftime("%Y-%m-%d")
link_path = time.strftime("/%Y/%m/%d/")
_post_path =  os.path.join(_base_path, "_posts")


def gen_post(title, category="默认"):
    content = "---\n"
    content += "title: "+ title + "\n"
    content += "author: admin\n"
    content += "layout: post\n"
    content += "permalink: " + link_path + quote(title) +'/' + "\n"
    content += "categories:\n"
    if category:
        content += "  - " + category + "\n" 
    content += "---"
    title = title.replace(' ', '-')
    filename = date + "-" + title + ".md"
    try :
        filepath = os.path.join(_post_path,filename)
        if os.path.isfile(filepath):
            print("file exist")
            return
        post = open(filepath, "w+")
        post.write(content)
        post.close()
        print("create", filename, "success!")
    except Exception as err:
        print(err)

if __name__ == "__main__":
    parser = OptionParser()
    parser.add_option("-t", dest="title", help="post title")
    parser.add_option("-c", dest="category", help="post category")
    (options, args) = parser.parse_args()
    if options.title:
        if options.category:
            gen_post(options.title, options.category)
        else:
            gen_post(options.title)
